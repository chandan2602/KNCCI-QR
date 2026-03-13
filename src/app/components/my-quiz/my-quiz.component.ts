import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-quiz',
  templateUrl: './my-quiz.component.html',
  styleUrls: ['./my-quiz.component.css']
})
export class MyQuizComponent implements OnInit {

  userId: number | null = Number(sessionStorage.getItem('UserId'));

  // State for the API-driven conversation
  conversationHistory: any[] = [];
  currentQuestion: any = null;
  chosenTraits: string[] = [];
  selectedOption: any = null;

  // State for UI control
  isLoading: boolean = false;
  isShowResult: boolean = false;
  isAnalyzing: boolean = false;
  analysisStep: number = 0;
  analysisSteps: string[] = [
    'Analyzing your personality traits...',
    'Processing your responses...',
    'Generating personality profile...',
    'Finding career matches...',
    'Creating recommendations...',
    'Finalizing your results...'
  ];

  // State for question loading
  loadingMessageIndex: number = 0;
  loadingMessages: string[] = [
    // 'Preparing your next question...',
    // 'Crafting personalized content...',
    // 'Loading career insights...',
    // 'Discovering your potential...',
    // 'Unlocking personality traits...',
    // 'Building your profile...'
  ];

  loadingTips: string[] = [
    'Answer honestly for the most accurate results',
    'There are no right or wrong answers',
    'Think about your natural preferences',
    'Consider what energizes you most',
    'Focus on your authentic self',
    'Trust your first instinct'
  ];

  // State for the final result object
  summaryResult: any = null;

  // State for question image
  currentQuestionImage: string = '';
  isImageLoading: boolean = false;

  // Cache for trait distribution to prevent recalculation on every change detection
  private cachedTraitDistribution: any[] | null = null;

  // private apiUrl = 'https://oukaidev.samvaadpro.com/hollandcode';
  private apiUrl = 'http://localhost:8000/hollandcode';

  // Holland code trait images mapping - will be populated dynamically
  private traitImages: { [key: string]: string[] } = {};

  // Track used images for each trait to avoid repetition
  private usedTraitImages: { [key: string]: string[] } = {};

  // Image file extensions to check for
  private imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

  // Maximum number of images to check per trait (adjust as needed)
  private maxImagesPerTrait = 10;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!this.userId) {
      this.toastr.error('User ID not found in session. Please login again.', 'Session Error');
      this.router.navigate(['/login']); // Redirect to login if no user ID
      return;
    }

    // Initialize trait images dynamically
    this.initializeTraitImages();

    // The main starting point is now the startAssessment function,
    // which handles all logic including cooldowns.
    this.startAssessment();
  }

  /**
   * Starts the assessment process.
   * This is the main entry point, handling both new tests and cooldown scenarios.
   */
  startAssessment(): void {
    console.log('Starting assessment - setting isLoading to true');
    this.isLoading = true;
    this.startQuestionLoadingAnimation();

    if (!this.userId) {
      this.toastr.error('Cannot start assessment without a User ID.');
      this.isLoading = false;
      this.stopQuestionLoadingAnimation();
      return;
    }

    // --- MODIFIED: Send user_id in the request body ---
    const payload = { user_id: this.userId };

    this.http.post<any>(`${this.apiUrl}/assessment/start`, payload).subscribe({
      next: (res) => {
        // --- MODIFIED: Handle the new unified response structure ---
        if (res.status === 'new_test_started') {
          // The API wants to start a new test - now reset state
          this.resetState();
          this.conversationHistory = res.test_data?.conversation_history || [];
          this.currentQuestion = res.test_data?.question_data?.status === 'questioning' ? res.test_data.question_data : null;
          if (this.currentQuestion) {
            this.updateQuestionImage();
          }
        } else if (res.status === 'cooldown_active_summary_returned') {
          // The user is on cooldown, and the API returned their previous summary.
          this.toastr.info('You have taken this test recently. Showing your previous results.', 'Assessment Cooldown');
          this.summaryResult = res.summary_data;
          // Populate chosenTraits from summary data if available
          if (res.summary_data?.chosen_traits) {
            this.chosenTraits = res.summary_data.chosen_traits;
          }
          // Clear cached trait distribution for new results
          this.cachedTraitDistribution = null;
          this.isShowResult = true;
          // Optionally save the returned result to sessionStorage
          sessionStorage.setItem('quizSummaryResult', JSON.stringify(this.summaryResult));
        }
        this.isLoading = false;
        this.stopQuestionLoadingAnimation();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.stopQuestionLoadingAnimation();
        const errorMessage = err.error?.detail || 'Failed to start assessment. Please try again later.';
        this.toastr.error(errorMessage, 'API Error');
      }
    });
  }

  onOptionSelect(option: any): void {
    this.selectedOption = option;
  }

  goToNextQuestion(): void {
    if (!this.selectedOption || this.isLoading) return;

    this.isLoading = true;
    this.startQuestionLoadingAnimation();
    this.chosenTraits.push(this.selectedOption.trait);
    const payload = {
      conversation_history: this.conversationHistory,
      user_selection: { text: this.selectedOption.text, trait: this.selectedOption.trait }
    };
    this.selectedOption = null;

    this.http.post<any>(`${this.apiUrl}/assessment/next`, payload).subscribe({
      next: (res) => {
        this.conversationHistory = res.conversation_history || [];
        if (res.question_data?.status === 'questioning') {
          this.currentQuestion = res.question_data;
          this.updateQuestionImage();
        } else if (res.question_data?.status === 'complete') {
          this.currentQuestion = null;
          this.currentQuestionImage = '';
          this.getSummary(); // The conversation is done, now fetch the final summary
        }
        this.isLoading = false;
        this.stopQuestionLoadingAnimation();
      },
      error: () => {
        this.isLoading = false;
        this.stopQuestionLoadingAnimation();
        this.toastr.error('Failed to get the next question.');
      }
    });
  }

  getSummary(): void {
    this.isLoading = true;
    this.isAnalyzing = true;
    this.analysisStep = 0;

    // Start the analysis animation
    this.startAnalysisAnimation();

    const payload = {
      user_id: this.userId,
      conversation_history: this.conversationHistory,
      chosen_traits: this.chosenTraits
    };

    this.http.post<any>(`${this.apiUrl}/assessment/summary`, payload).subscribe({
      next: (res) => {
        // Complete the analysis animation before showing results
        this.completeAnalysisAnimation(() => {
          this.summaryResult = res;
          this.isShowResult = true;
          this.isLoading = false;
          this.isAnalyzing = false;
          // Clear cached trait distribution for new results
          this.cachedTraitDistribution = null;
          // Save the new result to sessionStorage
          sessionStorage.setItem('quizSummaryResult', JSON.stringify(this.summaryResult));
        });
      },
      error: () => {
        this.isLoading = false;
        this.isAnalyzing = false;
        this.toastr.error('Failed to get the final summary.');
      }
    });
  }

  /**
   * Dynamically discovers available images for each trait
   */
  private async initializeTraitImages(): Promise<void> {
    const traits = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];
    const traitToFolder: { [key: string]: string } = {
      'realistic': 'R',
      'investigative': 'I',
      'artistic': 'A',
      'social': 'S',
      'enterprising': 'E',
      'conventional': 'C'
    };

    // Use fallback images immediately to ensure we have something to work with
    const fallbackImages: { [key: string]: string[] } = {
      realistic: ['R1.jpeg', 'R2.jpeg', 'R3.png', 'R4.jpg'],
      investigative: ['I1.png', 'I2.png', 'I3.png', 'I4.png'],
      artistic: ['A1.png', 'A2.png', 'A3.png', 'A4.png'],
      social: ['S1.png', 'S2.png', 'S3.png'],
      enterprising: ['E1.png', 'E2.png', 'E3.jpg', 'E4.png'],
      conventional: ['C1.png', 'C2.png', 'C3.webp']
    };

    // Initialize with fallback images first
    for (const trait of traits) {
      this.traitImages[trait] = [...(fallbackImages[trait] || [])];
    }

    // Then try to discover additional images asynchronously
    for (const trait of traits) {
      const folderLetter = traitToFolder[trait];
      const availableImages: string[] = [...(fallbackImages[trait] || [])];

      // Check for additional images with different naming patterns and extensions
      for (let i = 1; i <= this.maxImagesPerTrait; i++) {
        for (const ext of this.imageExtensions) {
          const imageName = `${folderLetter}${i}.${ext}`;

          // Skip if already in fallback list
          if (availableImages.includes(imageName)) {
            continue;
          }

          const imagePath = `assets/Holland_code_img/${folderLetter}/${imageName}`;

          // Check if image exists by trying to load it
          if (await this.imageExists(imagePath)) {
            availableImages.push(imageName);
          }
        }
      }

      this.traitImages[trait] = availableImages;
      console.log(`Found ${availableImages.length} images for ${trait}:`, availableImages);
    }
  }

  /**
   * Checks if an image exists at the given path with timeout
   */
  private imageExists(imagePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;

      // Set a timeout to avoid hanging
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      }, 3000); // 3 second timeout

      img.onload = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(true);
        }
      };

      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(false);
        }
      };

      img.src = imagePath;
    });
  }

  /**
   * Resets the component's state to its initial values for a new test.
   */
  private resetState(): void {
    this.isShowResult = false;
    this.summaryResult = null;
    this.chosenTraits = [];
    this.currentQuestion = null;
    this.selectedOption = null;
    this.conversationHistory = [];
    this.currentQuestionImage = '';
    this.isImageLoading = false;
    this.isAnalyzing = false;
    this.analysisStep = 0;
    this.loadingMessageIndex = 0;
    // Clear any running animations
    if ((this as any).analysisInterval) {
      clearInterval((this as any).analysisInterval);
    }
    if ((this as any).loadingInterval) {
      clearInterval((this as any).loadingInterval);
    }
    // Reset used images tracking for new assessment
    this.usedTraitImages = {};
    // Clear cached trait distribution
    this.cachedTraitDistribution = null;
  }

  /**
   * Gets a unique image path based on the question trait, avoiding repetition
   * Now validates image existence before returning path
   */
  private async getRandomImageForTrait(trait: string): Promise<string> {
    if (!trait) {
      console.log('No trait provided');
      return 'assets/Holland_code_img/R/R1.jpeg';
    }

    const traitLower = trait.toLowerCase();
    console.log('Trait (lowercase):', traitLower);

    let images = this.traitImages[traitLower];
    console.log('Available images for trait:', images);

    // Fallback to hardcoded images if dynamic discovery failed
    if (!images || images.length === 0) {
      console.log('No dynamically discovered images, using fallback for trait:', traitLower);
      const fallbackImages: { [key: string]: string[] } = {
        realistic: ['R1.jpeg', 'R2.jpeg', 'R3.png', 'R4.jpg'],
        investigative: ['I1.png', 'I2.png', 'I3.png', 'I4.png'],
        artistic: ['A1.png', 'A2.png', 'A3.png', 'A4.png'],
        social: ['S1.png', 'S2.png', 'S3.png'],
        enterprising: ['E1.png', 'E2.png', 'E3.jpg', 'E4.png'],
        conventional: ['C1.png', 'C2.png', 'C3.webp']
      };
      images = fallbackImages[traitLower] || [];
    }

    if (!images || images.length === 0) {
      console.log('No images found for trait:', traitLower);
      // Use trait-specific fallback
      const traitFallbacks: { [key: string]: string } = {
        'realistic': 'assets/Holland_code_img/R/R1.jpeg',
        'investigative': 'assets/Holland_code_img/I/I1.png',
        'artistic': 'assets/Holland_code_img/A/A1.png',
        'social': 'assets/Holland_code_img/S/S1.png',
        'enterprising': 'assets/Holland_code_img/E/E1.png',
        'conventional': 'assets/Holland_code_img/C/C1.png'
      };
      return traitFallbacks[traitLower] || 'assets/Holland_code_img/R/R1.jpeg';
    }

    // Initialize used images array for this trait if not exists
    if (!this.usedTraitImages[traitLower]) {
      this.usedTraitImages[traitLower] = [];
    }

    // Get unused images for this trait
    const usedImages = this.usedTraitImages[traitLower];
    const unusedImages = images.filter(image => !usedImages.includes(image));

    console.log('Used images for trait:', usedImages);
    console.log('Unused images for trait:', unusedImages);

    let selectedImage: string;
    let imagesToTry = unusedImages.length > 0 ? unusedImages : images;

    // If all images have been used, reset and start over
    if (unusedImages.length === 0) {
      console.log('All images used for trait, resetting used images list');
      this.usedTraitImages[traitLower] = [];
    }

    // Map trait names to folder letters
    const traitToFolder: { [key: string]: string } = {
      'realistic': 'R',
      'investigative': 'I',
      'artistic': 'A',
      'social': 'S',
      'enterprising': 'E',
      'conventional': 'C'
    };

    const folderLetter = traitToFolder[traitLower];
    if (!folderLetter) {
      console.log('Unknown trait:', traitLower);
      return 'assets/img/logo.png';
    }

    // Try to find a valid image by testing each one
    for (let i = 0; i < imagesToTry.length; i++) {
      const randomIndex = Math.floor(Math.random() * imagesToTry.length);
      selectedImage = imagesToTry[randomIndex];
      const imagePath = `assets/img/Holland_code_img/${folderLetter}/${selectedImage}`;

      // Validate that the image exists
      const imageExists = await this.imageExists(imagePath);
      if (imageExists) {
        // Mark this image as used
        if (!this.usedTraitImages[traitLower].includes(selectedImage)) {
          this.usedTraitImages[traitLower].push(selectedImage);
        }

        console.log('Selected valid image:', selectedImage);
        console.log('Full image path:', imagePath);
        return imagePath;
      } else {
        console.log('Image does not exist:', imagePath);
        // Remove this image from available images to avoid future attempts
        imagesToTry.splice(randomIndex, 1);
      }
    }

    // If no valid images found, return trait-specific fallback
    console.log('No valid images found for trait, using trait fallback');
    const traitFallbacks: { [key: string]: string } = {
      'realistic': 'assets/Holland_code_img/R/R1.jpeg',
      'investigative': 'assets/Holland_code_img/I/I1.png',
      'artistic': 'assets/Holland_code_img/A/A1.png',
      'social': 'assets/Holland_code_img/S/S1.png',
      'enterprising': 'assets/Holland_code_img/E/E1.png',
      'conventional': 'assets/Holland_code_img/C/C1.png'
    };
    return traitFallbacks[traitLower] || 'assets/Holland_code_img/R/R1.jpeg';
  }

  /**
   * Updates the current question image when a new question is received
   */
  private async updateQuestionImage(): Promise<void> {
    console.log('Current question:', this.currentQuestion);
    if (this.currentQuestion && this.currentQuestion.question_trait) {
      console.log('Question trait:', this.currentQuestion.question_trait);
      this.isImageLoading = true;
      try {
        this.currentQuestionImage = await this.getRandomImageForTrait(this.currentQuestion.question_trait);
        console.log('Generated image path:', this.currentQuestionImage);
      } catch (error) {
        console.error('Error loading image:', error);
        this.currentQuestionImage = 'assets/Holland_code_img/R/R1.jpeg';
      } finally {
        this.isImageLoading = false;
      }
    } else {
      this.currentQuestionImage = '';
      this.isImageLoading = false;
      console.log('No question trait found, clearing image');
    }
  }

  /**
   * Restarts the assessment process.
   * NOTE: The backend will still enforce the cooldown. This button allows the user
   * to re-fetch their results if they navigate away.
   */
  restart(): void {
    // We don't need to clear sessionStorage here. The startAssessment flow will handle it.
    this.startAssessment();
  }

  navToMyCourses(): void {
    if (this.summaryResult?.holland_code) {
      this.router.navigate(['/HOME/components/my-courses'], {
        state: { holland_code: this.summaryResult.holland_code }
      }).then(
        (success) => {
          if (!success) {
            this.toastr.error('Failed to navigate to courses page');
          }
        },
        (error) => {
          this.toastr.error('Error navigating to courses page');
          console.error('Navigation error:', error);
        }
      );
    } else {
      this.toastr.error('Holland code not available to find courses.');
    }
  }

  navToInternships(): void {
    if (this.summaryResult?.holland_code) {
      this.router.navigate(['/HOME/my-internship'], {
        relativeTo: this.route,
        queryParams: { code: this.summaryResult.holland_code }
      });
    } else {
      this.toastr.error('Could not retrieve your personality code.');
    }
  }

  navToRecommendedPaths(): void {
    if (this.summaryResult?.holland_code) {
      this.router.navigate(['/HOME/recommended-path'], {
        state: { holland_code: this.summaryResult.holland_code }
      }).then(
        (success) => {
          if (!success) {
            this.toastr.error('Failed to navigate to recommended paths');
          }
        },
        (error) => {
          this.toastr.error('Error navigating to recommended paths');
          console.error('Navigation error:', error);
        }
      );
    } else {
      this.toastr.error('Holland code not available to find recommended paths.');
    }
  }

  /**
   * Handles image loading errors
   */
  onImageError(event: any): void {
    console.log('Image failed to load:', event.target.src);
    // Set a trait-specific fallback image
    const fallbackImage = 'assets/Holland_code_img/R/R1.jpeg';
    event.target.src = fallbackImage;
    this.currentQuestionImage = fallbackImage;
  }

  /**
   * Gets trait distribution data for the chart
   */
  getTraitDistribution(): any[] {
    // Return cached result if available
    if (this.cachedTraitDistribution !== null) {
      return this.cachedTraitDistribution;
    }

    // If chosenTraits is empty but we have summary data, try to use that
    let traitsToUse = this.chosenTraits;
    if ((!traitsToUse || traitsToUse.length === 0) && this.summaryResult?.chosen_traits) {
      traitsToUse = this.summaryResult.chosen_traits;
    }

    console.log('getTraitDistribution - chosenTraits:', this.chosenTraits);
    console.log('getTraitDistribution - summaryResult.chosen_traits:', this.summaryResult?.chosen_traits);
    console.log('getTraitDistribution - traitsToUse:', traitsToUse);

    if (!traitsToUse || traitsToUse.length === 0) {
      console.log('getTraitDistribution - No traits available, creating fallback based on dominant trait');
      // Fallback: create distribution based on dominant trait if available
      if (this.summaryResult?.dominant_trait) {
        this.cachedTraitDistribution = this.createMockTraitDistribution();
        return this.cachedTraitDistribution;
      } else {
        this.cachedTraitDistribution = [];
        return this.cachedTraitDistribution;
      }
    }

    // Count occurrences of each trait
    const traitCounts: { [key: string]: number } = {};
    traitsToUse.forEach(trait => {
      const traitLower = trait.toLowerCase();
      traitCounts[traitLower] = (traitCounts[traitLower] || 0) + 1;
    });

    // Convert to percentage and create display data
    const total = traitsToUse.length;
    const traitColors: { [key: string]: string } = {
      'realistic': '#FF6B6B',
      'investigative': '#4ECDC4',
      'artistic': '#45B7D1',
      'social': '#96CEB4',
      'enterprising': '#FFEAA7',
      'conventional': '#DDA0DD'
    };

    const traitNames: { [key: string]: string } = {
      'realistic': 'Realistic',
      'investigative': 'Investigative',
      'artistic': 'Artistic',
      'social': 'Social',
      'enterprising': 'Enterprising',
      'conventional': 'Conventional'
    };

    this.cachedTraitDistribution = Object.keys(traitCounts).map(trait => ({
      name: trait,
      displayName: traitNames[trait] || trait,
      count: traitCounts[trait],
      percentage: Math.round((traitCounts[trait] / total) * 100),
      color: traitColors[trait] || '#95A5A6'
    })).sort((a, b) => b.percentage - a.percentage);

    return this.cachedTraitDistribution;
  }

  /**
   * Gets career icon based on index
   */
  getCareerIcon(index: number): string {
    const icons = [
      'fas fa-palette',
      'fas fa-users',
      'fas fa-heart',
      'fas fa-bullhorn',
      'fas fa-laptop-code',
      'fas fa-brain',
      'fas fa-calendar-alt'
    ];
    return icons[index % icons.length];
  }

  /**
   * Gets random match percentage for careers
   */
  getRandomMatch(): number {
    return Math.floor(Math.random() * 20) + 80; // 80-99% range
  }

  /**
   * Gets environment tags based on dominant trait
   */
  getEnvironmentTags(): string[] {
    const trait = this.summaryResult?.dominant_trait?.toLowerCase();
    const tagMap: { [key: string]: string[] } = {
      'realistic': ['Hands-on', 'Practical', 'Outdoors', 'Tools & Equipment'],
      'investigative': ['Research', 'Analysis', 'Problem-solving', 'Independent'],
      'artistic': ['Creative', 'Expressive', 'Flexible', 'Innovative'],
      'social': ['Collaborative', 'Helping Others', 'Communication', 'Team-oriented'],
      'enterprising': ['Leadership', 'Persuasive', 'Goal-oriented', 'Competitive'],
      'conventional': ['Organized', 'Structured', 'Detail-oriented', 'Systematic']
    };
    return tagMap[trait] || ['Dynamic', 'Professional', 'Growth-focused'];
  }

  /**
   * Gets personality strengths based on dominant trait
   */
  getPersonalityStrengths(): any[] {
    const trait = this.summaryResult?.dominant_trait?.toLowerCase();
    const strengthsMap: { [key: string]: any[] } = {
      'realistic': [
        { icon: 'fas fa-tools', title: 'Practical Problem Solver', description: 'You excel at finding hands-on solutions to real-world challenges.' },
        { icon: 'fas fa-cog', title: 'Technical Aptitude', description: 'Natural ability to work with tools, machines, and technical systems.' },
        { icon: 'fas fa-mountain', title: 'Independence', description: 'You work well autonomously and prefer concrete, tangible results.' }
      ],
      'investigative': [
        { icon: 'fas fa-microscope', title: 'Analytical Thinking', description: 'You have a natural curiosity and love to analyze complex problems.' },
        { icon: 'fas fa-book', title: 'Research Skills', description: 'Excellent at gathering information and conducting thorough investigations.' },
        { icon: 'fas fa-lightbulb', title: 'Innovation', description: 'You enjoy exploring new ideas and theoretical concepts.' }
      ],
      'artistic': [
        { icon: 'fas fa-paint-brush', title: 'Creative Expression', description: 'You have a natural talent for creative and artistic endeavors.' },
        { icon: 'fas fa-eye', title: 'Aesthetic Sense', description: 'Strong appreciation for beauty, design, and artistic elements.' },
        { icon: 'fas fa-theater-masks', title: 'Originality', description: 'You bring unique perspectives and innovative ideas to projects.' }
      ],
      'social': [
        { icon: 'fas fa-handshake', title: 'Interpersonal Skills', description: 'You excel at building relationships and working with others.' },
        { icon: 'fas fa-heart', title: 'Empathy', description: 'Natural ability to understand and help others with their needs.' },
        { icon: 'fas fa-comments', title: 'Communication', description: 'Strong verbal and written communication abilities.' }
      ],
      'enterprising': [
        { icon: 'fas fa-crown', title: 'Leadership', description: 'Natural ability to lead teams and drive organizational success.' },
        { icon: 'fas fa-chart-line', title: 'Business Acumen', description: 'Strong understanding of business operations and market dynamics.' },
        { icon: 'fas fa-rocket', title: 'Initiative', description: 'You take charge and are comfortable making important decisions.' }
      ],
      'conventional': [
        { icon: 'fas fa-clipboard-check', title: 'Organization', description: 'Excellent at creating and maintaining systematic approaches.' },
        { icon: 'fas fa-search', title: 'Attention to Detail', description: 'You notice important details that others might miss.' },
        { icon: 'fas fa-shield-alt', title: 'Reliability', description: 'Others can count on you to deliver consistent, quality results.' }
      ]
    };
    return strengthsMap[trait] || [
      { icon: 'fas fa-star', title: 'Versatile', description: 'You adapt well to different situations and challenges.' },
      { icon: 'fas fa-puzzle-piece', title: 'Problem Solver', description: 'You approach challenges with a systematic mindset.' },
      { icon: 'fas fa-trophy', title: 'Achievement-Oriented', description: 'You strive for excellence in your endeavors.' }
    ];
  }

  /**
   * Starts the analysis animation sequence
   */
  private startAnalysisAnimation(): void {
    this.analysisStep = 0;
    this.cycleAnalysisSteps();
  }

  /**
   * Cycles through analysis steps with timing
   */
  private cycleAnalysisSteps(): void {
    const stepInterval = setInterval(() => {
      this.analysisStep++;
      if (this.analysisStep >= this.analysisSteps.length) {
        this.analysisStep = 0; // Loop back to start
      }
    }, 1500); // Change step every 1.5 seconds

    // Store interval reference for cleanup
    (this as any).analysisInterval = stepInterval;
  }

  /**
   * Completes the analysis animation and shows results
   */
  private completeAnalysisAnimation(callback: () => void): void {
    // Clear the cycling interval
    if ((this as any).analysisInterval) {
      clearInterval((this as any).analysisInterval);
    }

    // Show final step
    this.analysisStep = this.analysisSteps.length - 1;

    // Wait a moment then execute callback
    setTimeout(() => {
      callback();
    }, 1000);
  }

  /**
   * Gets the current analysis step text
   */
  getCurrentAnalysisStep(): string {
    return this.analysisSteps[this.analysisStep] || 'Analyzing...';
  }

  /**
   * Starts the question loading animation
   */
  private startQuestionLoadingAnimation(): void {
    console.log('Starting question loading animation');
    this.loadingMessageIndex = 0;
    // Add a small delay before starting the cycling for first question
    setTimeout(() => {
      this.cycleLoadingMessages();
    }, 800);
  }

  /**
   * Cycles through loading messages
   */
  private cycleLoadingMessages(): void {
    const messageInterval = setInterval(() => {
      this.loadingMessageIndex = (this.loadingMessageIndex + 1) % this.loadingMessages.length;
    }, 1200); // Change message every 1.2 seconds

    // Store interval reference for cleanup
    (this as any).loadingInterval = messageInterval;
  }

  /**
   * Stops the question loading animation
   */
  private stopQuestionLoadingAnimation(): void {
    if ((this as any).loadingInterval) {
      clearInterval((this as any).loadingInterval);
    }
  }

  /**
   * Gets the current loading message
   */
  getCurrentLoadingMessage(): string {
    return this.loadingMessages[this.loadingMessageIndex] || 'Loading...';
  }

  /**
   * Gets a random loading tip
   */
  getRandomLoadingTip(): string {
    const randomIndex = Math.floor(Math.random() * this.loadingTips.length);
    return this.loadingTips[randomIndex];
  }

  /**
   * Gets the analysis progress percentage
   */
  getAnalysisProgress(): number {
    return Math.round(((this.analysisStep + 1) / this.analysisSteps.length) * 100);
  }

  /**
   * Creates a mock trait distribution based on the dominant trait
   * Ensures percentages always add up to exactly 100%
   */
  private createMockTraitDistribution(): any[] {
    const dominantTrait = this.summaryResult?.dominant_trait?.toLowerCase();
    if (!dominantTrait) return [];

    const allTraits = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];
    const traitColors: { [key: string]: string } = {
      'realistic': '#FF6B6B',
      'investigative': '#4ECDC4',
      'artistic': '#45B7D1',
      'social': '#96CEB4',
      'enterprising': '#FFEAA7',
      'conventional': '#DDA0DD'
    };

    const traitNames: { [key: string]: string } = {
      'realistic': 'Realistic',
      'investigative': 'Investigative',
      'artistic': 'Artistic',
      'social': 'Social',
      'enterprising': 'Enterprising',
      'conventional': 'Conventional'
    };

    // Create predefined distributions where each trait gets specific percentages
    // Each array represents [dominant, second, third, fourth, fifth, sixth] percentages
    const baseDistributions: { [key: string]: { [key: string]: number } } = {
      'realistic': {
        'realistic': 35, 'investigative': 18, 'artistic': 15, 'social': 12, 'enterprising': 12, 'conventional': 8
      },
      'investigative': {
        'investigative': 35, 'realistic': 18, 'artistic': 15, 'social': 12, 'enterprising': 12, 'conventional': 8
      },
      'artistic': {
        'artistic': 35, 'social': 18, 'investigative': 15, 'enterprising': 12, 'realistic': 12, 'conventional': 8
      },
      'social': {
        'social': 35, 'artistic': 18, 'enterprising': 15, 'investigative': 12, 'realistic': 12, 'conventional': 8
      },
      'enterprising': {
        'enterprising': 35, 'social': 18, 'realistic': 15, 'artistic': 12, 'investigative': 12, 'conventional': 8
      },
      'conventional': {
        'conventional': 35, 'realistic': 18, 'investigative': 15, 'social': 12, 'enterprising': 12, 'artistic': 8
      }
    };

    // Get the distribution for the dominant trait
    const distribution = baseDistributions[dominantTrait] || baseDistributions['realistic'];

    // Create the result array with all 6 traits
    const result: any[] = [];

    allTraits.forEach(trait => {
      result.push({
        name: trait,
        displayName: traitNames[trait] || trait,
        count: 0,
        percentage: distribution[trait] || 0,
        color: traitColors[trait] || '#95A5A6'
      });
    });

    // Sort by percentage (highest first) and return
    return result.sort((a, b) => b.percentage - a.percentage);
  }
}

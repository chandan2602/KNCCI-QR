import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/pages/base.component';
import { Router } from '@angular/router';

interface Recommendation {
  title: string;
  can_apply_skills: string;
  stipend: number | string;
  similarity_score: number;
  company_name: string;
  company_image: string;
  registration_startdate?: string;
  registration_enddate?: string;
}

interface StipendRange {
  label: string;
  value: string;
  min: number;
  max: number;
  icon: string;
}

interface SortOption {
  label: string;
  value: 'stipend_desc' | 'stipend_asc' | 'score_desc';
  icon: string;
}

@Component({
  selector: 'app-student-internship-recommender',
  templateUrl: './student-internship-recommender.component.html',
  styleUrls: ['./student-internship-recommender.component.css'],
})
export class StudentInternshipRecommenderComponent extends BaseComponent implements OnInit {

   private backendUrl = 'https://oukaidev.samvaadpro.com/recommendation/';
   // private backendUrl = 'http://127.0.0.1:8000/recommendation/';

  userId: any | null = Number(sessionStorage.getItem('UserId'));
  topN: number = 8;

  // Backend data
  recommendations: Recommendation[] = [];
  filteredRecommendations: Recommendation[] = [];

  // UI state
  selectedStipend: string | null = null;
  selectedSort: SortOption['value'] | null = null;
  expandedCards: Set<number> = new Set<number>(); // For "View More" toggle

  // Filter options
  stipendRanges: StipendRange[] = [
    { label: '0 - 5k', value: 'range1', min: 0, max: 5000, icon: 'fas fa-wallet' },
    { label: '5k - 10k', value: 'range2', min: 5000, max: 10000, icon: 'fas fa-hand-holding-usd' },
    { label: '10k+', value: 'range3', min: 10000, max: Number.POSITIVE_INFINITY, icon: 'fas fa-coins' },
  ];

  sortOptions: SortOption[] = [
    { label: 'Highest Stipend', value: 'stipend_desc', icon: 'fas fa-sort-amount-down' },
    { label: 'Lowest Stipend', value: 'stipend_asc', icon: 'fas fa-sort-amount-up' },
  ];

  loading: boolean = false;
  error: string = '';

  constructor(
    private http: HttpClient,
    public rtr: Router,
    protected toastr: ToastrService
  ) {
    super(null as any, toastr);
  }

  ngOnInit(): void {
    if (this.userId) {
      this.fetchRecommendations();
    } else {
      this.toastr.error('User ID not found in session. Please login again.', 'Session Error');
    }
  }

  fetchRecommendations(): void {
    this.loading = true;
    this.error = '';
    this.recommendations = [];

    const payload = {
      user_id: this.userId,
      top_n: this.topN,
    };

    this.http.post(this.backendUrl, payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.recommendations?.length > 0) {
          // Debug: Log the raw API response
          console.log('Raw API Response:', res);
          console.log('First recommendation raw data:', res.recommendations[0]);
          
          // ✅ Map and normalize data
          this.recommendations = res.recommendations.map((r: any) => {
            // Debug: Log all possible date field variations
            console.log('Date fields in recommendation:', {
              REGISTRATION_STARTDATE: r.REGISTRATION_STARTDATE,
              registration_startdate: r.registration_startdate,
              REGISTRATION_ENDDATE: r.REGISTRATION_ENDDATE,
              registration_enddate: r.registration_enddate,
              start_date: r.start_date,
              end_date: r.end_date,
              startDate: r.startDate,
              endDate: r.endDate
            });
            
            return {
              title: r.title,
              can_apply_skills: r.can_apply_skills,
              stipend: typeof r.stipend === 'string' ? Number(r.stipend) : r.stipend,
              similarity_score: r.similarity_score,
              company_name: r.company_name,
              company_image: r.company_image,
              registration_startdate: r.REGISTRATION_STARTDATE || r.registration_startdate || r.start_date || r.startDate,
              registration_enddate: r.REGISTRATION_ENDDATE || r.registration_enddate || r.end_date || r.endDate,
            };
          });
          this.applyFilters();
        } else {
          this.filteredRecommendations = [];
          this.toastr.info('No recommendations found for your profile.', 'Info');
        }
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.detail || err?.error?.text || 'Unable to fetch recommendations.';
        this.toastr.error(message, 'API Error');
      },
    });
  }

  // === UI actions ===
  selectStipend(value: string) {
    this.selectedStipend = value === this.selectedStipend ? null : value;
    this.applyFilters();
  }

  selectSort(value: SortOption['value']) {
    this.selectedSort = value === this.selectedSort ? null : value;
    this.applyFilters();
  }

  toggleViewMore(index: number): void {
    if (this.expandedCards.has(index)) {
      this.expandedCards.delete(index);
    } else {
      this.expandedCards.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedCards.has(index);
  }

  // === Helpers ===
  extractSkills(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  applyFilters() {
    let data = [...this.recommendations];

    // Filter by stipend
    if (this.selectedStipend) {
      const range = this.stipendRanges.find((r) => r.value === this.selectedStipend);
      if (range) {
        data = data.filter((item) => {
          const stipend = typeof item.stipend === 'number' ? item.stipend : Number(item.stipend);
          return stipend >= range.min && stipend <= range.max;
        });
      }
    }

    // Sort logic
    if (this.selectedSort === 'stipend_desc') {
      data.sort((a, b) => Number(b.stipend) - Number(a.stipend));
    } else if (this.selectedSort === 'stipend_asc') {
      data.sort((a, b) => Number(a.stipend) - Number(b.stipend));
    } else if (this.selectedSort === 'score_desc') {
      data.sort((a, b) => b.similarity_score - a.similarity_score);
    }

    this.filteredRecommendations = data;
  }

  ApplyForInternship(rec: Recommendation) {
    if (sessionStorage.UserId)
      this.rtr.navigate(['view-course-details'], { state: rec });
    else
      this.rtr.navigate(['eRP/view-course-details'], { state: rec });
  }
}

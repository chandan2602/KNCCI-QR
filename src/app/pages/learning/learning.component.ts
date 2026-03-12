import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base.component';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

interface SubModule {
  id: number;
  name: string;
  description: string;
  duration: string;
}

interface Module {
  id: number;
  name: string;
  description: string;
  subModules: SubModule[];
  isExpanded: boolean;
}

interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  modules: Module[];
  progress: number;
}

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent extends BaseComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  expandedModuleId: number | null = null;

  constructor(CommonService: CommonService, toastr: ToastrService, private router: Router) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    // Dummy data for demo purpose
    this.courses = [
      {
        id: 1,
        name: 'Business Fundamentals',
        description: 'Learn the basics of business management and entrepreneurship',
        instructor: 'John Smith',
        progress: 45,
        modules: [
          {
            id: 1,
            name: 'Introduction to Business',
            description: 'Understand the core concepts of business',
            isExpanded: false,
            subModules: [
              {
                id: 1,
                name: 'What is Business?',
                description: 'Definition and types of business',
                duration: '15 mins'
              },
              {
                id: 2,
                name: 'Business Models',
                description: 'Different business models and their applications',
                duration: '20 mins'
              },
              {
                id: 3,
                name: 'Market Analysis',
                description: 'How to analyze your target market',
                duration: '25 mins'
              }
            ]
          },
          {
            id: 2,
            name: 'Financial Management',
            description: 'Master the fundamentals of financial planning',
            isExpanded: false,
            subModules: [
              {
                id: 4,
                name: 'Budgeting Basics',
                description: 'Create and manage budgets effectively',
                duration: '20 mins'
              },
              {
                id: 5,
                name: 'Cash Flow Management',
                description: 'Understanding cash flow and liquidity',
                duration: '25 mins'
              },
              {
                id: 6,
                name: 'Financial Statements',
                description: 'Reading and interpreting financial statements',
                duration: '30 mins'
              }
            ]
          },
          {
            id: 3,
            name: 'Marketing Strategies',
            description: 'Develop effective marketing strategies',
            isExpanded: false,
            subModules: [
              {
                id: 7,
                name: 'Digital Marketing',
                description: 'Leverage digital channels for marketing',
                duration: '25 mins'
              },
              {
                id: 8,
                name: 'Brand Building',
                description: 'Create a strong brand identity',
                duration: '20 mins'
              },
              {
                id: 9,
                name: 'Customer Engagement',
                description: 'Build lasting customer relationships',
                duration: '22 mins'
              }
            ]
          }
        ]
      }
    ];

    if (this.courses.length > 0) {
      this.selectCourse(this.courses[0]);
    }
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
  }

  toggleModule(module: Module): void {
    module.isExpanded = !module.isExpanded;
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'info';
    if (progress >= 25) return 'warning';
    return 'danger';
  }

  startLesson(subModule: SubModule): void {
    this.toastr.info(`Starting lesson: ${subModule.name}`, 'Learning');
  }

  completeLesson(subModule: SubModule): void {
    this.toastr.success(`Completed: ${subModule.name}`, 'Learning');
  }

  completeCourse(): void {
    this.router.navigate(['/HOME/hooland-exam']);
  }
}

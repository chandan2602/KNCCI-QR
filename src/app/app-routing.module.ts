import { PrivacyPolicyComponent } from './components/organization-details/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/organization-details/terms-conditions/terms-conditions.component';
import { RefundPolicyComponent } from './components/organization-details/refund-policy/refund-policy.component';
import { ContactUs1Component } from './components/organization-details/contact-us/contact-us1.component';
import { AboutUsComponent } from './components/organization-details/about-us/about-us.component';
import { ERPComponent } from './erp/erp.component';
import { TutorPaymentsComponent } from './components/tutor/tutor-payments/tutor-payments.component';
import { EnrolledStudentsComponent } from './components/tutor/enrolled-students/enrolled-students.component';
import { MyReviewComponent } from './components/tutor/my-review/my-review.component';
import { AutocompleteDemoComponent } from './components/tutor/autocomplete-demo/autocomplete-demo.component';
import { CoursesResolver } from './resolvers/coursesResolver.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { KncciCoursesComponent } from './pages/kncci-courses/kncci-courses.component';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { PolsComponent } from './pages/pols/pols.component';
import { TakepolsComponent } from './pages/takepols/takepols.component';
import { SurveysComponent } from './pages/surveys/surveys.component';
import { TakesurveysComponent } from './pages/takesurveys/takesurveys.component';
import { SubmitassignmentsComponent } from './pages/submitassignments/submitassignments.component';
import { JoinconferenceComponent } from './pages/joinconference/joinconference.component';
import { LearningmaterialComponent } from './pages/learningmaterial/learningmaterial.component';
import { PostassessmentComponent } from './pages/postassessment/postassessment.component';
import { MyresultsComponent } from './pages/myresults/myresults.component';
import { StartexamComponent } from './pages/startexam/startexam.component';
import { TimetrackerComponent } from './pages/timetracker/timetracker.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AddassignmentComponent } from './pages/addassignment/addassignment.component';
import { EvaluateassignmentsComponent } from './pages/evaluateassignments/evaluateassignments.component';
import { EvaluateassessmentComponent } from './pages/evaluateassessment/evaluateassessment.component';
import { ExamresultComponent } from './pages/examresult/examresult.component';
import { CourcesessionsComponent } from './pages/courcesessions/courcesessions.component';
import { CreatepolComponent } from './pages/createpol/createpol.component';
import { CreatesurveyComponent } from './pages/createsurvey/createsurvey.component';
import { AddpolComponent } from './pages/addpol/addpol.component';
import { AddsurveyComponent } from './pages/addsurvey/addsurvey.component';
import { AddsurveyquestionComponent } from './pages/addsurveyquestion/addsurveyquestion.component';
import { CreateFAQsComponent } from './pages/create-faqs/create-faqs.component';
import { FeedbackquestionaireComponent } from './pages/feedbackquestionaire/feedbackquestionaire.component'
import { FeedbackResultsComponent } from './pages/feedback-results/feedback-results.component'
import { SmtpComponent } from './pages/smtp/smtp.component';
import { TaskmanagerComponent } from './pages/taskmanager/taskmanager.component';
import { NewsComponent } from './pages/news/news.component';
import { CourceCategoryComponent } from './pages/cource-category/cource-category.component';
import { CourceTypeComponent } from './pages/cource-type/cource-type.component';
import { CourcesComponent } from './pages/cources/cources.component';
import { ChaptersComponent } from './pages/chapters/chapters.component';
import { EnrollComponent } from './pages/enroll/enroll.component';
import { RegulationsComponent } from './pages/regulations/regulations.component';
import { AttainmentlevelComponent } from './pages/attainmentlevel/attainmentlevel.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { AssignMaterialsComponent } from './pages/assign-materials/assign-materials.component';
import { ContentManagerComponent } from './pages/content-manager/content-manager.component';
import { AssessmentQuestionnaireComponent } from './pages/assessment-questionnaire/assessment-questionnaire.component';
import { ScheduleAssessmentComponent } from './pages/schedule-assessment/schedule-assessment.component';
import { MasterAssessmentComponent } from './pages/master-assessment/master-assessment.component';
import { AttendanceComponent } from './pges/attendance/attendance.component';
import { CourceAssignTrainerComponent } from './pges/cource-assign-trainer/cource-assign-trainer.component';
import { CourceScheduleComponent } from './pges/cource-schedule/cource-schedule.component';
import { AddCourceScheduleComponent } from './pges/add-cource-schedule/add-cource-schedule.component';
import { CourceAssignUsersComponent } from './pges/cource-assign-users/cource-assign-users.component';
import { MailBoxComponent } from './pges/mail-box/mail-box.component';
import { ForumComponent } from './pges/forum/forum.component';
import { ForumTopicsComponent } from './pges/forum-topics/forum-topics.component';
import { AddAsseementQuestioniareComponent } from './pages/add-asseement-questioniare/add-asseement-questioniare.component';
import { AddMasterAssessmentComponent } from './pages/add-master-assessment/add-master-assessment.component';
import { CourseshAssignUsersComponent } from './pages/coursesh-assign-users/coursesh-assign-users.component';
import { CourseshAssigntrainersComponent } from './pages/coursesh-assigntrainers/coursesh-assigntrainers.component';
import { CourseProgramOutcomeComponent } from './pages/course-program-outcome/course-program-outcome.component';
import { RoleComponent } from './pages/role/role.component';
import { TaskInRolesComponent } from './pages/task-in-roles/task-in-roles.component';
import { MyPostsComponent } from './pages/my-posts/my-posts.component';
import { AllBlogsComponent } from './pages/all-blogs/all-blogs.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { ViewPostComponent } from './pages/view-post/view-post.component';
import { Resolver } from './services/resolve.service';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';
import { AddUserRegistrationComponent } from './pages/add-user-registration/add-user-registration.component';
import { EditUserRegistrationComponent } from './pages/edit-user-registration/edit-user-registration.component';
import { TenantRegistrationComponent } from './pages/tenant-registration/tenant-registration.component';
import { CreateTenantRegistrationComponent } from './pages/create-tenant-registration/create-tenant-registration.component';
import { ContentAuthoringComponent } from './pages/content-authoring/content-authoring.component';
import { BackupManagerComponent } from './pages/backup-manager/backup-manager.component';
import { OfflinePaymentComponent } from './pages/offline-payment/offline-payment.component';
import { BillingInformationComponent } from './pages/billing-information/billing-information.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { PollResultsComponent } from './pages/poll-results/poll-results.component';
import { EventRequestComponent } from './pages/event-request/event-request.component';
import { DataDictionaryComponent } from './pages/data-dictionary/data-dictionary.component';
import { SubscriptionTaskComponent } from './pages/subscription-task/subscription-task.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { DetailedAssessmentComponent } from './pages/reports/detailed-assessment/detailed-assessment.component';
import { StudentInformationComponent } from './pages/reports/student-information/student-information.component';
import { CourseTrainersDetailsComponent } from './pages/reports/course-trainers-details/course-trainers-details.component';
import { CourseInformationReportComponent } from './pages/reports/course-information-report/course-information-report.component';
import { OnlineExamreportComponent } from './pages/reports/online-examreport/online-examreport.component';
import { OnlineCoursesReportComponent } from './pages/reports/online-courses-report/online-courses-report.component';
import { OnlineCoursesDetailsReportComponent } from './pages/reports/online-courses-details-report/online-courses-details-report.component';
import { UserReportComponent } from './pages/reports/user-report/user-report.component';
import { CoursewiseperformanceReportComponent } from './pages/reports/coursewiseperformance-report/coursewiseperformance-report.component';
import { AssessmentResultComponent } from './pages/assessment-result/assessment-result.component';
import { AttendanceDetailsReportComponent } from './pages/reports/attendance-details-report/attendance-details-report.component';
import { TrainingCalendarComponent } from './pages/training-calendar/training-calendar.component';
import { UploadTemplateComponent } from './pages/upload-template/upload-template.component';
import { MainComponent } from './pages/iscribe/main/main.component';
import { StudentCgpaComponent } from './pages/reports/student-cgpa/student-cgpa.component'
import { StudentSGPAReportComponent } from './pages/reports/student-sgpa-report/student-sgpa-report.component'
import { VisualEditorComponent } from './pages/visual-editor/visual-editor.component';
import { FolderComponent } from './pages/folder/folder.component';
import { SemesterComponent } from './pages/semester/semester.component';
import { StudentAdmissionComponent } from './pages/student-admission/student-admission.component';
import { AddStudentAdmissionComponent } from './pages/add-student-admission/add-student-admission.component';
import { AcademicYearComponent } from './pages/academic-year/academic-year.component';
import { NewTeacherComponent } from './pages/new-teacher/new-teacher.component';
import { AddNewTeacherComponent } from './pages/add-new-teacher/add-new-teacher.component';
import { FeesTypeComponent } from './pages/fees-type/fees-type.component';
import { FeeReceivableComponent } from './pages/fee-receivable/fee-receivable.component';
import { FeeDescriptionComponent } from './pages/fee-description/fee-description.component';
import { EditFeesComponent } from './pages/edit-fees/edit-fees.component';
import { CurriculumComponent } from './pages/curriculum/curriculum.component';
import { StudentFeereceivableComponent } from './pages/student-feereceivable/student-feereceivable.component';
import { StudentRegistrationApprovalComponent } from './pages/student-registration-approval/student-registration-approval.component';
import { ContentResourcesComponent } from './pages/content-resources/content-resources.component';
import { ContentClassComponent } from './pages/content-class/content-class.component';
import { ContentChapterComponent } from './pages/content-chapter/content-chapter.component';
import { ContentSubjectComponent } from './pages/content-subject/content-subject.component';
import { ContentRepoAddComponent } from './pages/content-repo-add/content-repo-add.component';
import { ContentRepoComponent } from './pages/content-repo/content-repo.component';
import { BookAllocationReportComponent } from './pages/book-allocation-report/book-allocation-report.component';
import { BookAllocationViewReportComponent } from './pages/book-allocation-view-report/book-allocation-view-report.component';
import { StudentsReportComponent } from './pages/students-report/students-report.component';
import { FetchAssignedBooksComponent } from './pages/fetch-assigned-books/fetch-assigned-books.component';
import { ReturnDateComponent } from './pages/return-date/return-date.component';
import { UpdateReturnDateComponent } from './pages/update-return-date/update-return-date.component';
import { LibraryManagementSystemComponent } from './pages/library-management-system/library-management-system.component';
import { LibraryBooksAllocationComponent } from './pages/library-books-allocation/library-books-allocation.component';
import { ListOfBooksComponent } from './pages/list-of-books/list-of-books.component';
import { DepartmentComponent } from './pages/department/department.component';
import { HolidayNotificationComponent } from './pages/holiday-notification/holiday-notification.component';
import { ViewNewsComponent } from './pages/view-news/view-news.component';
import { ViewDiscussionComponent } from './pages/view-discussion/view-discussion.component';
import { SamvaadMeetingsComponent } from './pages/samvaad-meetings/samvaad-meetings.component';
import { CourseComponent } from './pages/course/course.component';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { TutorHomeComponent } from './components/tutor/tutor-home/tutor-home.component';
import { TutorLoginComponent } from './components/tutor/tutor-login/tutor-login.component';
import { TutorSignupComponent } from './components/tutor/tutor-signup/tutor-signup.component';
import { AllCategoryCoursesComponent } from './components/tutor/all-category-courses/all-category-courses.component';
import { ChangePasswordComponent } from './components/tutor/change-password/change-password.component';
import { ViewCourseDetailsComponent } from './components/tutor/view-course-details/view-course-details.component';
import { StudentHomeComponent } from './components/tutor/student-home/student-home.component';
import { ViewAllDetailsComponent } from './pages/view-all-details/view-all-details.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyTutorsComponent } from './pages/my-tutors/my-tutors.component';
import { MyPaymentsComponent } from './pages/my-payments/my-payments.component';
import { MyLanguageComponent } from './pages/my-language/my-language.component';
import { LevelofLearnerComponent } from './pages/levelof-learner/levelof-learner.component';
import { ViewQrcodeComponent } from './pages/view-qrcode/view-qrcode.component';
import { TrainerDashboardComponent } from './pages/trainer-dashboard/trainer-dashboard.component';
import { ViewProfileComponent } from './components/tutor/view-profile/view-profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ConfigureImagesComponent } from './pages/configure-images/configure-images.component';
import { ApprovalDomainComponent } from './pages/approval-domain/approval-domain.component';
import { StudentSignupComponent } from './components/tutor/student-signup/student-signup.component';
import { ApproveComponent } from './pages/approve/approve.component';
import { InvoiceComponent } from './components/tutor/invoice/invoice.component';
import { WellcomeRegistraionComponent } from './pages/wellcome-registraion/wellcome-registraion.component';
import { CompanyRegistrationComponent } from './pages/company-registration/company-registration.component';
import { RecordingScheduleComponent } from './pages/recording-schedule/recording-schedule.component';
import { CourseReportComponent } from './pages/course-report/course-report.component';
import { TrainerReportComponent } from './pages/trainer-report/trainer-report.component';
import { TraineeReportComponent } from './pages/trainee-report/trainee-report.component';
import { FeeReportComponent } from './pages/fee-report/fee-report.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { LearningResourcesComponent } from './pages/learning-resources/learning-resources.component';
import { CompanyDetailsComponent } from './pages/company-details/company-details.component';
import { AdvertisementsComponent } from './pages/advertisements/advertisements.component';
import { StudentAppliedInternshipsComponent } from './pages/student-applied-internships/student-applied-internships.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobAddComponent } from './components/job-add/job-add.component';
import { ApplyJobComponent } from './components/apply-job/apply-job.component';
import { JobSummeryComponent } from './components/job-summery/job-summery.component';
import { JobAppliedLstComponent } from './components/job-applied-lst/job-applied-lst.component';
import { MyJobsComponent } from './components/my-jobs/my-jobs.component';
import { HeaderContactsComponent } from './components/tutor/header-contacts/header-contacts.component';
import { HeaderInternshipsComponent } from './components/tutor/header-internships/header-internships.component';
import { HeaderCorporatesComponent } from './components/tutor/header-corporates/header-corporates.component';
import { HeaderJobsComponent } from './components/tutor/header-jobs/header-jobs.component';
import { SubHeaderComponent } from './components/tutor/sub-header/sub-header.component';
import { JobsInCompanyLstComponent } from './components/jobs-in-company-lst/jobs-in-company-lst.component';
import { ApprenticeshipsComponent } from './pages/apprenticeships/apprenticeships.component';
import { ApprenticeshipDetailsComponent } from './pages/apprenticeship-details/apprenticeship-details.component';
import { StartsUpComponent } from './components/tutor/starts-up/starts-up.component';
import { IncubatorRegComponent } from './components/shared/incubator-reg/incubator-reg.component';
import { InvestorRegComponent } from './components/shared/investor-reg/investor-reg.component';
import { StartsUpRegComponent } from './components/shared/starts-up-reg/starts-up-reg.component';
import { ApprovalSignupComponent } from './components/approval-signup/approval-signup.component';
import { StartupListComponent } from './components/startup-list/startup-list.component';
import { FounderDashboardComponent } from './components/founder-dashboard/founder-dashboard.component';
import { IncubatorDashboardComponent } from './components/incubator-dashboard/incubator-dashboard.component';
import { InvestorDashboardComponent } from './components/investor-dashboard/investor-dashboard.component';
import { FounderMenuComponent } from './components/shared/founder-menu/founder-menu.component';
import { IncubatorLstComponent } from './components/incubator-lst/incubator-lst.component';
import { InvestorLstComponent } from './components/investor-lst/investor-lst.component';
import { FounderProfileComponent } from './components/founder-profile/founder-profile.component';
import { IncubatorProfileComponent } from './components/incubator-profile/incubator-profile.component';
import { InvestorProfileComponent } from './components/investor-profile/investor-profile.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SystemSettingsComponent } from './pages/system-settings/system-settings.component';
import { LandingComponent } from './landing/landing.component';
import { LandingAboutComponent } from './landing/landing-about/landing-about.component';
import { LandingContactComponent } from './landing/landing-contact/landing-contact.component';
import { IntrenshipLstComponent } from './components/intrenship-lst/intrenship-lst.component';
import { ResumesListComponent } from './components/resumes-list/resumes-list.component';
import { InternshipSummaryComponent } from './components/internship-summary/internship-summary.component';
import { StartupProfileComponent } from './components/startup-profile/startup-profile.component';
import { ApproveJobsInternshipsComponent } from './components/approve-jobs-internships/approve-jobs-internships.component';
import { PostingInternshipViewComponent } from './components/posting-internship-view/posting-internship-view.component';
import { PostingJobViewComponent } from './components/posting-job-view/posting-job-view.component';
import { SubscriptionListComponent } from './components/subscription-list/subscription-list.component';
import { JobsMenuComponent } from './components/jobs-menu/jobs-menu.component';
import { InternshipMenuComponent } from './components/internship-menu/internship-menu.component';
import { StudentInternshipMenuComponent } from './components/student-internship-menu/student-internship-menu.component';
import { StudentJobMenuComponent } from './components/student-job-menu/student-job-menu.component';
import { PublicApprenticeshipsComponent } from './pages/public-apprenticeships/public-apprenticeships.component';
import { PublicCoursesComponent } from './pages/public-courses/public-courses.component';
import { PublicInternshipsComponent } from './pages/public-internships/public-internships.component';
import { PublicJobsComponent } from './pages/public-jobs/public-jobs.component';
import { LearningComponent } from './pages/learning/learning.component';
import { MyQuizComponent } from './components/my-quiz/my-quiz.component';
import { HoolandCodeComponent } from './pages/hooland-code/hooland-code.component';

const routes: Routes = [
  {
    path: 'HOME',
    component: HomeComponent,

    children: [
      {
        path: 'dashboard',
        component: MaincontentComponent
      },
      {
        path: 'kncci-courses',
        component: KncciCoursesComponent
      },
      {
        path: 'learning',
        component: LearningComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { path: 'founderProfile', component: FounderProfileComponent },
      { path: 'incubtrProfile', component: IncubatorProfileComponent },
      { path: 'investrProfile', component: InvestorProfileComponent },
      { path: 'founder-view', component: FounderProfileComponent },
      { path: 'incubtr-view', component: IncubatorProfileComponent },
      { path: 'investr-view', component: InvestorProfileComponent },
      { path: 'startup-profle', component: StartupProfileComponent },
      { path: 'aprve-job-internship', component: ApproveJobsInternshipsComponent },
      {
        path: 'poll',
        component: PolsComponent,
      },
      {
        path: 'takepoll',
        component: TakepolsComponent
      },
      {
        path: 'surveys',
        component: SurveysComponent
      },
      {
        path: 'takesurvey',
        component: TakesurveysComponent
      }, {
        path: 'submitassignment',
        component: SubmitassignmentsComponent
      }, {
        path: 'joinconference',
        component: JoinconferenceComponent
      }, {
        path: 'learningmaterial',
        component: LearningmaterialComponent
      }, {
        path: 'postassessment',
        component: PostassessmentComponent
      },
      {
        path: 'myresults',
        component: MyresultsComponent
      },
      {
        path: 'takeExam',
        component: StartexamComponent
      },
      {
        path: 'hooland-exam',
        component: MyQuizComponent
      },
      {
        path: 'hooland-code',
        component: HoolandCodeComponent
      },
      {
        path: 'timeTracker',
        component: TimetrackerComponent
      },
      {
        path: 'assignments',
        component: AssignmentsComponent
      },
      {
        path: 'addAssignments',
        component: AddassignmentComponent
      },
      {
        path: 'evaluateAssignments',
        component: EvaluateassignmentsComponent
      },
      {
        path: 'evaluateAssessment',
        component: EvaluateassessmentComponent
      },
      {
        path: 'examResult',
        component: ExamresultComponent
      },
      {
        path: "courseSessions",
        component: CourcesessionsComponent
      },
      {
        path: "createPolls",
        component: CreatepolComponent
      },
      {
        path: "createSurvey",
        component: CreatesurveyComponent
      },
      {
        path: 'addPoll',
        component: AddpolComponent
      },
      {
        path: 'addSurvey',
        component: AddsurveyComponent
      },
      {
        path: 'surveyQuestion',
        component: AddsurveyquestionComponent
      },
      {
        path: "createFAQs",
        component: CreateFAQsComponent

      },
      {
        path: 'feedbackQuestionnaire',
        component: FeedbackquestionaireComponent
      },
      {
        path: 'feedbackResults',
        component: FeedbackResultsComponent
      },
      {
        path: 'smtp',
        component: SmtpComponent
      },
      {
        path: 'taskmanager',
        component: TaskmanagerComponent
      },
      {
        path: 'news',
        component: NewsComponent
      }, {
        path: 'courseCategory',
        component: CourceCategoryComponent
      },
      {
        path: 'courseType',
        component: CourceTypeComponent
      },
      {
        path: "courses",
        component: CourcesComponent
      },
      {
        path: 'course-assignTrainer',
        component: CourceAssignTrainerComponent,
      },
      {
        path: 'course-programOutcome',
        component: CourseProgramOutcomeComponent
      },
      {
        path: 'chapters',
        component: ChaptersComponent
      },
      {
        path: 'enroll',
        component: EnrollComponent
      },
      {
        path: "regulations",
        component: RegulationsComponent
      },
      {
        path: 'attainmentlevel',
        component: AttainmentlevelComponent
      }, {
        path: 'rooms',
        component: RoomsComponent
      }, {
        path: 'configurematerials',
        component: AssignMaterialsComponent
      },
      {
        path: 'contentmanager',
        component: ContentManagerComponent
      },
      {
        path: 'assessmentQuestionnaire',
        component: AssessmentQuestionnaireComponent
      },
      {
        path: 'asssessemnt/:id',
        component: AddAsseementQuestioniareComponent
      },
      {
        path: 'scheduleAssessment',
        component: ScheduleAssessmentComponent
      },
      {
        path: 'masterAssessment',
        component: MasterAssessmentComponent
      },
      {
        path: 'masterAssessment/:id',
        component: AddMasterAssessmentComponent
      },
      {
        path: 'attendance',
        component: AttendanceComponent
      },

      {
        path: 'courseSchedule',
        component: CourceScheduleComponent
      },
      {
        path: 'courseSchedule/:id',
        component: AddCourceScheduleComponent
      },
      {
        path: 'courseSchedule-AssignUser',
        component: CourseshAssignUsersComponent
      },
      {
        path: 'courseSchedule-AssignTrainer',
        component: CourseshAssigntrainersComponent
      },
      {
        path: 'mailBox',
        component: MailBoxComponent
      },
      {
        path: 'forums',
        component: ForumComponent
      },
      {
        path: 'forumTopics',
        component: ForumTopicsComponent
      }, {
        path: 'role',
        component: RoleComponent
      },
      {
        path: 'taskInRole',
        component: TaskInRolesComponent
      },
      {
        path: 'myPosts',
        component: MyPostsComponent
      },
      {
        path: 'allBlogs',
        component: AllBlogsComponent
      },
      {
        path: 'blogs',
        component: BlogsComponent
      },
      {
        path: 'viewPost',
        component: ViewPostComponent
      },
      {
        path: 'usersRegistrationList',
        component: UserRegistrationComponent
      },
      {
        path: 'jobList',
        component: JobListComponent
      },
      {
        path: 'jobAppliedList',
        component: JobAppliedLstComponent
      },
      {
        path: 'resumeLst',
        component: ResumesListComponent
      },
      {
        path: 'job',
        component: JobAddComponent
      },
      { path: 'applyJob', component: ApplyJobComponent },
      { path: 'jobsMnu', component: JobsMenuComponent },
      { path: 'sIntrnShpMnu', component: StudentInternshipMenuComponent },
      { path: 'sjobsMnu', component: StudentJobMenuComponent },
      { path: 'internshipMnu', component: InternshipMenuComponent },
      { path: 'startsupList', component: StartupListComponent },
      { path: 'incubatrList', component: IncubatorLstComponent },
      { path: 'invstrList', component: InvestorLstComponent },
      { path: 'founder-dshbrd', component: FounderDashboardComponent },
      { path: 'incubator-dshbrd', component: IncubatorDashboardComponent },
      { path: 'investor-dshbrd', component: InvestorDashboardComponent },
      { path: 'intereShipList', component: IntrenshipLstComponent },
      { path: 'internshipSummery', component: InternshipSummaryComponent },
      {
        path: 'userRegistration',
        component: EditUserRegistrationComponent
      },
      {
        path: 'cmpnyLst',
        component: JobsInCompanyLstComponent
      },
      {
        path: 'apprenticeships',
        component: ApprenticeshipsComponent
      },
      {
        path: 'apprenticeship-details/:id',
        component: ApprenticeshipDetailsComponent
      },
      {
        path: 'addUserRegistration',
        component: AddUserRegistrationComponent
      },
      // {
      //   path: 'editUserRegistration',
      //   component: EditUserRegistrationComponent
      // },
      {
        path: 'tenantRegistration',
        component: TenantRegistrationComponent
      },
      {
        path: 'tenantRegistration/:id',
        component: CreateTenantRegistrationComponent
      },
      {
        path: 'contentAuthoring',
        component: ContentAuthoringComponent
      },
      {
        path: 'backupManager',
        component: BackupManagerComponent
      },
      {
        path: 'offlinePayment',
        component: OfflinePaymentComponent
      },
      {
        path: 'billingInformation',
        component: BillingInformationComponent
      },
      {
        path: 'subject',
        component: SubjectComponent
      },
      {
        path: 'pollResults',
        component: PollResultsComponent
      },
      {
        path: 'eventRequest',
        component: EventRequestComponent
      },
      {
        path: 'meetings',
        component: SamvaadMeetingsComponent
      },
      {
        path: 'dataDictionary',
        component: DataDictionaryComponent
      },
      {
        path: 'subscriptionTasks',
        component: SubscriptionTaskComponent
      },
      {
        path: 'locations',
        component: LocationsComponent
      },
      {
        path: 'DetailedAssessment',
        component: DetailedAssessmentComponent
      },
      {
        path: 'studentInformation',
        component: StudentInformationComponent
      },
      {
        path: 'courseTrainersReport',
        component: CourseTrainersDetailsComponent
      },
      {
        path: 'courseInformationReport',
        component: CourseInformationReportComponent
      },
      {
        path: 'onlineExamReport',
        component: OnlineExamreportComponent
      },
      {
        path: 'onlineCoursesReport',
        component: OnlineCoursesReportComponent
      },
      {
        path: 'onlineCoursesDeatilsReport',
        component: OnlineCoursesDetailsReportComponent
      },
      {
        path: 'userReport',
        component: UserReportComponent
      },
      {
        path: 'courseWisePerformance',
        component: CoursewiseperformanceReportComponent
      },
      {
        path: 'assessmentResult',
        component: AssessmentResultComponent
      },
      {
        path: "attendanceReport",
        component: AttendanceDetailsReportComponent
      },
      {
        path: 'trainingCalendar',
        component: TrainingCalendarComponent
      },
      {
        path: 'uploadTemplate',
        component: UploadTemplateComponent
      },
      {
        path: 'iscribe',
        component: MainComponent
      },
      {
        path: 'CGPA_Report',
        component: StudentCgpaComponent
      },
      {
        path: 'SGPA_Report',
        component: StudentSGPAReportComponent
      },
      {
        path: 'visualcontent',
        component: VisualEditorComponent
      },
      {
        path: 'foldermanagemnet',
        component: FolderComponent
      },
      {
        path: 'semester',
        component: SemesterComponent
      },
      {
        path: 'studentAdmission',
        component: StudentAdmissionComponent
      },
      {
        path: 'addstudentAdmission',
        component: AddStudentAdmissionComponent
      },
      {
        path: 'addNewTeacher',
        component: AddNewTeacherComponent
      },
      {
        path: 'addNewTeacher/:id',
        component: AddNewTeacherComponent
      },
      {
        path: 'NewTeacher',
        component: NewTeacherComponent
      },
      {

        path: 'feesType',
        component: FeesTypeComponent
      },
      {
        path: 'feesDescription',
        component: FeeDescriptionComponent
      },
      {
        path: 'editFees',
        component: EditFeesComponent
      },
      {
        path: 'editFees/:id',
        component: EditFeesComponent
      },
      {
        path: 'curriculum',
        component: CurriculumComponent
      },
      {
        path: 'AcademicYear',
        component: AcademicYearComponent
      },
      {
        path: 'feeReceivable',
        component: FeeReceivableComponent
      },
      {
        path: 'studentFeeReceivable',
        component: StudentFeereceivableComponent
      },
      {
        path: 'studentRegistrationApproval',
        component: StudentRegistrationApprovalComponent
      },

      {
        path: 'contentRepository',
        component: ContentRepoComponent
      },
      {
        path: 'contentRepository/:id',
        component: ContentRepoAddComponent
      },
      {
        path: 'contentSubject',
        component: ContentSubjectComponent
      },
      {
        path: "contentChapter",
        component: ContentChapterComponent
      },

      {
        path: "contentClass",
        component: ContentClassComponent
      },
      {
        path: 'contentResources',
        component: ContentResourcesComponent
      },
      {
        path: 'bookAllocation',
        component: BookAllocationReportComponent
      },
      {
        path: 'viewReport',
        component: BookAllocationViewReportComponent
      },
      {
        path: 'assignedBooks',
        component: FetchAssignedBooksComponent
      },
      {
        path: 'studentReport',
        component: StudentsReportComponent
      },
      {
        path: "returnDate",
        component: ReturnDateComponent
      },
      {
        path: 'updateReturnDate',
        component: UpdateReturnDateComponent
      },
      {
        path: 'libraryManagementSystem',
        component: LibraryManagementSystemComponent
      },
      {
        path: 'libraryBooksAllocated',
        component: LibraryBooksAllocationComponent
      },
      {
        path: 'listofbooks',
        component: ListOfBooksComponent

      },
      {
        path: 'department',
        component: DepartmentComponent
      },
      {
        path: 'holidayNotification',
        component: HolidayNotificationComponent
      },
      {
        path: 'viewNews/:id',
        component: ViewNewsComponent
      },
      {
        path: 'viewNews',
        component: ViewNewsComponent
      },
      {
        path: 'viewDiscussion/:id',
        component: ViewDiscussionComponent
      },
      {
        path: 'viewDiscussion',
        component: ViewDiscussionComponent
      },
      {
        path: 'course',
        component: CourseComponent
      },
      {
        path: 'viewCourse',
        component: ViewCourseComponent
      },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'view-all-details', component: ViewAllDetailsComponent },
      { path: 'all-courses', component: CoursesComponent },
      { path: 'my-courses', component: MyCoursesComponent },
      { path: 'my-tutors', component: MyTutorsComponent },
      { path: 'my-payments', component: MyPaymentsComponent },
      { path: 'my-subscriptions', component: SubscriptionListComponent },
      { path: 'my-reviews', component: MyReviewComponent },
      { path: 'enrolled-student', component: EnrolledStudentsComponent },
      { path: 'tutor-payments', component: TutorPaymentsComponent },
      { path: 'my-language', component: MyLanguageComponent },
      { path: 'levelof-learner', component: LevelofLearnerComponent },
      { path: 'trainer-dashboard', component: TrainerDashboardComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'configure-images', component: ConfigureImagesComponent },
      { path: 'approval-domain', component: ApprovalDomainComponent },
      { path: 'approval-signup', component: ApprovalSignupComponent },
      { path: 'approve', component: ApproveComponent },
      { path: 'recording', component: RecordingScheduleComponent },
      { path: 'course-report', component: CourseReportComponent },
      { path: 'trainer-report', component: TrainerReportComponent },
      { path: 'trainee-report', component: TraineeReportComponent },
      { path: 'fee-report', component: FeeReportComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'learning-resources', component: LearningResourcesComponent },
      { path: 'company-details', component: CompanyDetailsComponent },
      // TODO: Uncomment when advertisements feature is needed
      // { path: 'advertisements', component: AdvertisementsComponent },
      { path: 'appliedInternships', component: StudentAppliedInternshipsComponent },
      { path: 'myJobs', component: MyJobsComponent },
      { path: 'apply_job', component: ApplyJobComponent },
      { path: 'startsUp', component: StartsUpComponent },
      { path: 'subscribe', component: SubscribeComponent },
      { path: 'system-settings', component: SystemSettingsComponent },
      { path: 'jobSummery', component: JobSummeryComponent },
      // { path: 'internshipSummery', component: InternshipSummaryComponent },
    ],

  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  // {
  //   path: 'Home/dashboard',
  //   redirectTo: 'home',
  // },
  // {
  //   path: '**',
  //   redirectTo: 'home'
  // }
  // {
  //   path: '',
  //   redirectTo: 'tutore-home',
  //   pathMatch: 'full'
  // },
  {
    path: 'tutore-home', component: TutorHomeComponent, resolve: { courseData: CoursesResolver }
  },
  {
    path: 'student-home', component: StudentHomeComponent, resolve: { courseData: CoursesResolver }
  },
  {
    path: 'auto-demo', component: AutocompleteDemoComponent
  },
  { path: 'view-qrcode', component: ViewQrcodeComponent },
  {
    path: 'all-category-courses',
    component: AllCategoryCoursesComponent
  },

  { path: 'view-course-details', component: ViewCourseDetailsComponent },
  { path: 'jobSummery', component: JobSummeryComponent },
  { path: 'apply_job', component: ApplyJobComponent },
  { path: 'menu', component: FounderMenuComponent },

  { path: 'all-category-courses', component: AllCategoryCoursesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: TutorSignupComponent },
  { path: 'incubatorReg', component: IncubatorRegComponent },
  { path: 'investorReg', component: InvestorRegComponent },
  { path: 'startsUpReg', component: StartsUpRegComponent },
  { path: 'student-signup', component: StudentSignupComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'wellcome', component: WellcomeRegistraionComponent },
  { path: 'company-registration', component: CompanyRegistrationComponent },
  { path: 'contact', component: HeaderContactsComponent },
  // { path: 'internships', component: HeaderInternshipsComponent }, // Replaced with PublicInternshipsComponent
  { path: 'corporates', component: HeaderCorporatesComponent },
  // { path: 'jobs', component: HeaderJobsComponent }, // Replaced with PublicJobsComponent

  {
    path: 'menu', component: SubHeaderComponent,
    children: [
      { path: 'contact', component: HeaderContactsComponent },
      { path: 'internships', component: HeaderInternshipsComponent },
      { path: 'corporates', component: HeaderCorporatesComponent },
      { path: 'jobs', component: HeaderJobsComponent },
      { path: 'contact', component: HeaderContactsComponent },
      { path: 'startsUp', component: StartsUpComponent }
    ]

  },

  {
    path: 'eRP', component: ERPComponent,
    children: [
      { path: 'about-us', component: AboutUsComponent },
      { path: 'contact-us', component: ContactUs1Component },
      { path: 'refund-policy', component: RefundPolicyComponent },
      { path: 'terms-conditions', component: TermsConditionsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'view-course-details', component: ViewCourseDetailsComponent },
      { path: 'view-profile', component: ViewProfileComponent },
      { path: 'jobSummery', component: JobSummeryComponent },
      { path: 'internship-view', component: PostingInternshipViewComponent },
      { path: 'job-view', component: PostingJobViewComponent },

      // { path: 'view-profile:/id', component: ViewProfileComponent },
    ]
  },
  {
    path: 'subscribe',
    component: SubscribeComponent
  },
  // { path: '**', redirectTo: 'tutore-home' },
  { path: '', redirectTo: 'default', pathMatch: 'full' }, // { path: '', component: LandingComponent },
  { path: 'default', component: LandingComponent },
  { path: 'about', component: LandingAboutComponent },
  { path: 'job', component: LandingComponent },
  { path: 'internship', component: LandingComponent },
  { path: 'internships', component: PublicInternshipsComponent },
  { path: 'jobs', component: PublicJobsComponent },
  { path: 'courses', component: PublicCoursesComponent },
  { path: 'apprenticeships', component: PublicApprenticeshipsComponent },
  { path: 'corporate', component: LandingComponent },
  { path: 'contacts', component: LandingContactComponent },
  { path: 'cmpnyLst', component: JobsInCompanyLstComponent },
  // { path: '', component: TutorHomeComponent },
  { path: '**', redirectTo: 'default' },
  // { path: 'invalid', component: LandingComponent },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { useHash: true })],
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// resolve:{menu:Resolver},

import { ProfileViewCountsComponent } from './components/tutor/view-profile/profile-view-counts/profile-view-counts.component';
import { PrivacyPolicyComponent } from './components/organization-details/privacy-policy/privacy-policy.component';
import { HeaderNewComponent } from './components/shared/header-new/header-new.component';
import { FooterNewComponent } from './components/shared/footer/footer-new.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { httpInterceptorProviders } from 'src/interceptor';
import { LoginService } from './services/login.service';
import { PolsComponent } from './pages/pols/pols.component';
import { TakepolsComponent } from './pages/takepols/takepols.component';
import { SurveysComponent } from './pages/surveys/surveys.component';
import { TakesurveysComponent } from './pages/takesurveys/takesurveys.component';
import { SubmitassignmentsComponent } from './pages/submitassignments/submitassignments.component';
import { LearningmaterialComponent } from './pages/learningmaterial/learningmaterial.component';
import { PostassessmentComponent } from './pages/postassessment/postassessment.component';
import { JoinconferenceComponent } from './pages/joinconference/joinconference.component';
import { MyresultsComponent } from './pages/myresults/myresults.component';
import { FooterComponent } from './footer/footer.component';
import { DataTablesModule } from 'angular-datatables';
import { StartexamComponent } from './pages/startexam/startexam.component';
import { CountdownModule } from 'ngx-countdown';
import { TimetrackerComponent } from './pages/timetracker/timetracker.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AddassignmentComponent } from './pages/addassignment/addassignment.component';
import { EvaluateassignmentsComponent } from './pages/evaluateassignments/evaluateassignments.component';
import { EvaluateassessmentComponent } from './pages/evaluateassessment/evaluateassessment.component';
import { ExamresultComponent } from './pages/examresult/examresult.component';
import { CourcesessionsComponent } from './pages/courcesessions/courcesessions.component';
import { SafePipe } from './pipes/safe.pipe';
import { CreatepolComponent } from './pages/createpol/createpol.component';
import { AddpolComponent } from './pages/addpol/addpol.component';
import { CreatesurveyComponent } from './pages/createsurvey/createsurvey.component';
import { AddsurveyComponent } from './pages/addsurvey/addsurvey.component';
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddsurveyquestionComponent } from './pages/addsurveyquestion/addsurveyquestion.component';
import { CreateFAQsComponent } from './pages/create-faqs/create-faqs.component';
import { FeedbackquestionaireComponent } from './pages/feedbackquestionaire/feedbackquestionaire.component';
import { FeedbackResultsComponent } from './pages/feedback-results/feedback-results.component';
import { SmtpComponent } from './pages/smtp/smtp.component';
import { TaskmanagerComponent } from './pages/taskmanager/taskmanager.component';
import { NewsComponent } from './pages/news/news.component';
import { CourceTypeComponent } from './pages/cource-type/cource-type.component';
import { CourceCategoryComponent } from './pages/cource-category/cource-category.component';
import { CourcesComponent } from './pages/cources/cources.component';
import { EnrollComponent } from './pages/enroll/enroll.component';
import { ChaptersComponent } from './pages/chapters/chapters.component';
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
import { CourseshAssigntrainersComponent } from './pages/coursesh-assigntrainers/coursesh-assigntrainers.component';
import { CourseshAssignUsersComponent } from './pages/coursesh-assign-users/coursesh-assign-users.component';
import { CourseProgramOutcomeComponent } from './pages/course-program-outcome/course-program-outcome.component';
import { RoleComponent } from './pages/role/role.component';
import { TaskInRolesComponent } from './pages/task-in-roles/task-in-roles.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { AllBlogsComponent } from './pages/all-blogs/all-blogs.component';
import { MyPostsComponent } from './pages/my-posts/my-posts.component';
import { PublishedPostsComponent } from './components/published-posts/published-posts.component';
import { DraftmypostsComponent } from './components/draftmyposts/draftmyposts.component';
import { ViewPostComponent } from './pages/view-post/view-post.component';
import { CommentsComponent } from './components/comments/comments.component'
import { Resolver } from './../app/services/resolve.service'
import { from } from 'rxjs';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';
import { AddUserRegistrationComponent } from './pages/add-user-registration/add-user-registration.component';
import { EditUserRegistrationComponent } from './pages/edit-user-registration/edit-user-registration.component';
import { PersonalDataComponent } from './components/userregistration/personal-data/personal-data.component';
import { ContactDetailsComponent } from './components/userregistration/contact-details/contact-details.component';
import { EducationComponent } from './components/userregistration/education/education.component';
import { SkillsComponent } from './components/userregistration/skills/skills.component';
import { ProjectsComponent } from './components/userregistration/projects/projects.component';
import { WorkExperienceComponent } from './components/userregistration/work-experience/work-experience.component';
import { LanguagesComponent } from './components/userregistration/languages/languages.component';
import { AddressComponent } from './components/userregistration/address/address.component';
import { AboutMeComponent } from './components/userregistration/about-me/about-me.component';
import { TenantRegistrationComponent } from './pages/tenant-registration/tenant-registration.component';
import { CreateTenantRegistrationComponent } from './pages/create-tenant-registration/create-tenant-registration.component';
import { ContentAuthoringComponent } from './pages/content-authoring/content-authoring.component';
import { BackupManagerComponent } from './pages/backup-manager/backup-manager.component';
import { OfflinePaymentComponent } from './pages/offline-payment/offline-payment.component';
import { BillingInformationComponent } from './pages/billing-information/billing-information.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { BlockCopyPasteDirective } from './../app/directives/block-copy-paste.directive'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChartsModule } from 'ng2-charts';
import { PollResultsComponent } from './pages/poll-results/poll-results.component';
import { DataDictionaryComponent } from './pages/data-dictionary/data-dictionary.component';
import { EventRequestComponent } from './pages/event-request/event-request.component';
import { SubscriptionTaskComponent } from './pages/subscription-task/subscription-task.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { DetailedAssessmentComponent } from './pages/reports/detailed-assessment/detailed-assessment.component';
import { StudentInformationComponent } from './pages/reports/student-information/student-information.component';
import { CourseTrainersDetailsComponent } from './pages/reports/course-trainers-details/course-trainers-details.component';
import { AttendanceDetailsReportComponent } from './pages/reports/attendance-details-report/attendance-details-report.component';
import { CourseInformationReportComponent } from './pages/reports/course-information-report/course-information-report.component';
import { OnlineExamreportComponent } from './pages/reports/online-examreport/online-examreport.component';
import { OnlineCoursesReportComponent } from './pages/reports/online-courses-report/online-courses-report.component';
import { OnlineCoursesDetailsReportComponent } from './pages/reports/online-courses-details-report/online-courses-details-report.component';
import { UserReportComponent } from './pages/reports/user-report/user-report.component';
import { CoursewiseperformanceReportComponent } from './pages/reports/coursewiseperformance-report/coursewiseperformance-report.component';
import { AssessmentResultComponent } from './pages/assessment-result/assessment-result.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingCalendarComponent } from './pages/training-calendar/training-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { UploadTemplateComponent } from './pages/upload-template/upload-template.component';
import { MainComponent } from './pages/iscribe/main/main.component';
import { PageComponent } from './pages/iscribe/page/page.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { PaintComponent } from './components/paint/paint.component';
import { StudentCgpaComponent } from './pages/reports/student-cgpa/student-cgpa.component';
import { StudentSGPAReportComponent } from './pages/reports/student-sgpa-report/student-sgpa-report.component';
import { TreenodeComponent } from './components/treenode/treenode.component';
import { FolderComponent } from './pages/folder/folder.component';
import { VisualEditorComponent } from './pages/visual-editor/visual-editor.component';
import { SemesterComponent } from './pages/semester/semester.component';
import { StudentAdmissionComponent } from './pages/student-admission/student-admission.component';
import { AddStudentAdmissionComponent } from './pages/add-student-admission/add-student-admission.component';
import { NewTeacherComponent } from './pages/new-teacher/new-teacher.component';
import { AddNewTeacherComponent } from './pages/add-new-teacher/add-new-teacher.component';
import { AcademicYearComponent } from './pages/academic-year/academic-year.component';
import { ComposeMailComponent } from './components/compose-mail/compose-mail.component';
import { ViewmailComponent } from './components/viewmail/viewmail.component';
import { FeesTypeComponent } from './pages/fees-type/fees-type.component';
import { FeeReceivableComponent } from './pages/fee-receivable/fee-receivable.component';
import { FeeDescriptionComponent } from './pages/fee-description/fee-description.component';
import { EditFeesComponent } from './pages/edit-fees/edit-fees.component';
import { CurriculumComponent } from './pages/curriculum/curriculum.component';
import { StudentFeereceivableComponent } from './pages/student-feereceivable/student-feereceivable.component';
import { StudentRegistrationApprovalComponent } from './pages/student-registration-approval/student-registration-approval.component';
import { ContentClassComponent } from './pages/content-class/content-class.component';
import { ContentSubjectComponent } from './pages/content-subject/content-subject.component';
import { ContentChapterComponent } from './pages/content-chapter/content-chapter.component';
import { ContentRepoComponent } from './pages/content-repo/content-repo.component';
import { ContentRepoAddComponent } from './pages/content-repo-add/content-repo-add.component';
import { ContentResourcesComponent } from './pages/content-resources/content-resources.component';
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
import { DatePipe } from '@angular/common';
import { MetismenuAngularModule } from "@metismenu/angular";
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { CourseComponent } from './pages/course/course.component';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { TutorHomeComponent } from './components/tutor/tutor-home/tutor-home.component';
import { TutorSignupComponent } from './components/tutor/tutor-signup/tutor-signup.component';
import { TutorLoginComponent } from './components/tutor/tutor-login/tutor-login.component';
import { MainFooterComponent } from './components/shared/main-footer/main-footer.component';
import { PartnersComponent } from './components/tutor/partners/partners.component';
import { TestMonialsComponent } from './components/tutor/test-monials/test-monials.component';
import { TrendingCoursesComponent } from './components/tutor/trending-courses/trending-courses.component';
import { ContactUsComponent } from './components/tutor/contact-us/contact-us.component';
import { ContactUs1Component } from './components/organization-details/contact-us/contact-us1.component';
import { AllCoursesComponent } from './components/tutor/all-courses/all-courses.component';
import { AllCategoriesComponent } from './components/tutor/all-categories/all-categories.component';
import { AboutUsComponent } from './components/tutor/about-us/about-us.component';
import { MainSliderComponent } from './components/tutor/main-slider/main-slider.component';
import { AllCategoryCoursesComponent } from './components/tutor/all-category-courses/all-category-courses.component';
import { CoursesResolver } from './resolvers/coursesResolver.resolver';
import { ChangePasswordComponent } from './components/tutor/change-password/change-password.component';
import { ViewCourseDetailsComponent } from './components/tutor/view-course-details/view-course-details.component';
import { StudentHomeComponent } from './components/tutor/student-home/student-home.component';
import { AutocompleteDemoComponent } from './components/tutor/autocomplete-demo/autocomplete-demo.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ViewAllDetailsComponent } from './pages/view-all-details/view-all-details.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyTutorsComponent } from './pages/my-tutors/my-tutors.component';
import { MyPaymentsComponent } from './pages/my-payments/my-payments.component';
import { TutoreMenuComponent } from './sidebar/tutore-menu/tutore-menu.component';
import { StudentMenuComponent } from './sidebar/student-menu/student-menu.component';
import { MyReviewComponent } from './components/tutor/my-review/my-review.component';
import { EnrolledStudentsComponent } from './components/tutor/enrolled-students/enrolled-students.component';
import { TutorPaymentsComponent } from './components/tutor/tutor-payments/tutor-payments.component';
import { MyLanguageComponent } from './pages/my-language/my-language.component';
import { LevelofLearnerComponent } from './pages/levelof-learner/levelof-learner.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { QrCodeComponent } from './components/userregistration/qr-code/qr-code.component';
import { ViewQrcodeComponent } from './pages/view-qrcode/view-qrcode.component';
import { TrainerDashboardComponent } from './pages/trainer-dashboard/trainer-dashboard.component';
import { AccountDetailsComponent } from './components/userregistration/account-details/account-details.component';
import { IdProofComponent } from './components/userregistration/id-proof/id-proof.component';
import { ERPComponent } from './erp/erp.component';
import { TermsConditionsComponent } from './components/organization-details/terms-conditions/terms-conditions.component';
import { RefundPolicyComponent } from './components/organization-details/refund-policy/refund-policy.component';
import { PaidInstallmentsComponent } from './components/tutor/paid-installments/paid-installments.component';
import { ViewProfileComponent } from './components/tutor/view-profile/view-profile.component';
import { UserProfileComponent } from './components/tutor/view-profile/user-profile/user-profile.component';
import { DataTableComponent } from './components/tutor/view-profile/data-table/data-table.component';
import { AutocompleteOffDirective } from './autocomplete-off.directive';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ConfigureImagesComponent } from './pages/configure-images/configure-images.component';
import { ApprovalDomainComponent } from './pages/approval-domain/approval-domain.component';
import { StudentSignupComponent } from './components/tutor/student-signup/student-signup.component';
import { ApproveComponent } from './pages/approve/approve.component';
import { InvoiceComponent } from './components/tutor/invoice/invoice.component';
import { WellcomeRegistraionComponent } from './pages/wellcome-registraion/wellcome-registraion.component';
import { CompanyRegistrationComponent } from './pages/company-registration/company-registration.component';
import { RecordingScheduleComponent } from './pages/recording-schedule/recording-schedule.component';
import { BulletListComponent } from './pages/cources/bullet-list/bullet-list.component';
import { StudentAddressComponent } from './pages/student-address/student-address.component';
import { CourseReportComponent } from './pages/course-report/course-report.component';
import { TrainerReportComponent } from './pages/trainer-report/trainer-report.component';
import { TraineeReportComponent } from './pages/trainee-report/trainee-report.component';
import { FeeReportComponent } from './pages/fee-report/fee-report.component';
import { ShowFileComponent } from './pages/trainee-report/show-file/show-file.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { LearningResourcesComponent } from './pages/learning-resources/learning-resources.component';
import { CompanyDetailsComponent } from './pages/company-details/company-details.component';
import { AdvertisementsComponent } from './pages/advertisements/advertisements.component';
import { ViewAdsComponent } from './view-ads/view-ads.component';
import { StudentAppliedInternshipsComponent } from './pages/student-applied-internships/student-applied-internships.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobAddComponent } from './components/job-add/job-add.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ApplyJobComponent } from './components/apply-job/apply-job.component';
import { JobSummeryComponent } from './components/job-summery/job-summery.component';
import { SubHeaderComponent } from './components/tutor/sub-header/sub-header.component';
import { HeaderJobsComponent } from './components/tutor/header-jobs/header-jobs.component';
import { HeaderContactsComponent } from './components/tutor/header-contacts/header-contacts.component';
import { MyJobsComponent } from './components/my-jobs/my-jobs.component';
import { JobAppliedLstComponent } from './components/job-applied-lst/job-applied-lst.component';
import { HeaderInternshipsComponent } from './components/tutor/header-internships/header-internships.component';
import { HeaderCorporatesComponent } from './components/tutor/header-corporates/header-corporates.component';
import { StartsUpComponent } from './components/tutor/starts-up/starts-up.component';
import { JobsInCompanyLstComponent } from './components/jobs-in-company-lst/jobs-in-company-lst.component';
import { IncubatorRegComponent } from './components/shared/incubator-reg/incubator-reg.component';
import { InvestorRegComponent } from './components/shared/investor-reg/investor-reg.component';
import { StartsUpRegComponent } from './components/shared/starts-up-reg/starts-up-reg.component';
// import { ApprovalSignupComponent } from './components/approval-signup/approval-signup.component'; // DISABLED
import { FounderMenuComponent } from './components/shared/founder-menu/founder-menu.component';
import { StartupListComponent } from './components/startup-list/startup-list.component';
import { IncubatorDashboardComponent } from './components/incubator-dashboard/incubator-dashboard.component';
import { InvestorDashboardComponent } from './components/investor-dashboard/investor-dashboard.component';
import { FounderDashboardComponent } from './components/founder-dashboard/founder-dashboard.component';
import { IncubatorLstComponent } from './components/incubator-lst/incubator-lst.component';
import { InvestorLstComponent } from './components/investor-lst/investor-lst.component';
import { LandingComponent } from './landing/landing.component';
import { LandingHomeComponent } from './landing/landing-home/landing-home.component';
import { LandingAboutComponent } from './landing/landing-about/landing-about.component';
import { LandingJobsComponent } from './landing/landing-jobs/landing-jobs.component';
import { LandingInternsComponent } from './landing/landing-interns/landing-interns.component';
import { LandingCorporateComponent } from './landing/landing-corporate/landing-corporate.component';
import { LandingContactComponent } from './landing/landing-contact/landing-contact.component';
import { IncubatorProfileComponent } from './components/incubator-profile/incubator-profile.component';
import { InvestorProfileComponent } from './components/investor-profile/investor-profile.component';
import { FounderProfileComponent } from './components/founder-profile/founder-profile.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { IntrenshipLstComponent } from './components/intrenship-lst/intrenship-lst.component';
import { ResumesListComponent } from './components/resumes-list/resumes-list.component';
import { InternshipSummaryComponent } from './components/internship-summary/internship-summary.component';
import { ApproveJobsInternshipsComponent } from './components/approve-jobs-internships/approve-jobs-internships.component';
import { StartupProfileComponent } from './components/startup-profile/startup-profile.component';
import { PostingJobViewComponent } from './components/posting-job-view/posting-job-view.component';
import { PostingInternshipViewComponent } from './components/posting-internship-view/posting-internship-view.component';
import { SubscriptionListComponent } from './components/subscription-list/subscription-list.component';
import { TooltipDirective } from './tooltip.directive';
import { JobsMenuComponent } from './components/jobs-menu/jobs-menu.component';
import { InternshipMenuComponent } from './components/internship-menu/internship-menu.component';
import { StudentInternshipMenuComponent } from './components/student-internship-menu/student-internship-menu.component';
import { StudentJobMenuComponent } from './components/student-job-menu/student-job-menu.component';
import { StudentInternshipRecommenderComponent } from './student-internship-recommender/student-internship-recommender.component';
import { ChatWidgetComponent } from './components/shared/chat-widget/chat-widget.component';
import { PublicHeaderComponent } from './components/public-header/public-header.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { KncciCoursesComponent } from './pages/kncci-courses/kncci-courses.component';
import { PublicCoursesComponent } from './pages/public-courses/public-courses.component';
import { PublicApprenticeshipsComponent } from './pages/public-apprenticeships/public-apprenticeships.component';
import { PublicInternshipsComponent } from './pages/public-internships/public-internships.component';
import { ApprenticeshipsComponent } from './pages/apprenticeships/apprenticeships.component';
import { ApprenticeshipDetailsComponent } from './pages/apprenticeship-details/apprenticeship-details.component';
import { ApprenticeshipsScheduleComponent } from './pages/apprenticeships-schedule/apprenticeships-schedule.component';
import { ApprenticeshipsApplicationsComponent } from './pages/apprenticeships-applications/apprenticeships-applications.component';
import { PublicJobsComponent } from './pages/public-jobs/public-jobs.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function momentAdapterFactory() {
  return adapterFactory(moment);
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MaincontentComponent,
    LoginComponent,
    HomeComponent,
    PolsComponent,
    TakepolsComponent,
    SurveysComponent,
    TakesurveysComponent,
    SubmitassignmentsComponent,
    LearningmaterialComponent,
    PostassessmentComponent,
    JoinconferenceComponent,
    MyresultsComponent,
    FooterComponent,
    StartexamComponent,
    TimetrackerComponent,
    AssignmentsComponent,
    AddassignmentComponent,
    EvaluateassignmentsComponent,
    EvaluateassessmentComponent,
    ExamresultComponent,
    CourcesessionsComponent,
    SafePipe,
    CreatepolComponent,
    AddpolComponent,
    CreatesurveyComponent,
    AddsurveyComponent,
    AddsurveyquestionComponent,
    CreateFAQsComponent,
    FeedbackquestionaireComponent,
    FeedbackResultsComponent,
    SmtpComponent,
    TaskmanagerComponent,
    NewsComponent,
    CourceTypeComponent,
    CourceCategoryComponent,
    CourcesComponent,
    EnrollComponent,
    ChaptersComponent,
    RegulationsComponent,
    AttainmentlevelComponent,
    RoomsComponent,
    AssignMaterialsComponent,
    ContentManagerComponent,
    AssessmentQuestionnaireComponent,
    ScheduleAssessmentComponent,
    MasterAssessmentComponent,
    AttendanceComponent,
    CourceAssignTrainerComponent,
    CourceScheduleComponent,
    AddCourceScheduleComponent,
    CourceAssignUsersComponent,
    MailBoxComponent,
    ForumComponent,
    ForumTopicsComponent,
    AddAsseementQuestioniareComponent,
    AddMasterAssessmentComponent,
    CourseshAssigntrainersComponent,
    CourseshAssignUsersComponent,
    CourseProgramOutcomeComponent,
    RoleComponent,
    TaskInRolesComponent,
    BlogsComponent,
    AllBlogsComponent,
    MyPostsComponent,
    PublishedPostsComponent,
    DraftmypostsComponent,
    ViewPostComponent,
    CommentsComponent,
    UserRegistrationComponent,
    AddUserRegistrationComponent,
    EditUserRegistrationComponent,
    PersonalDataComponent,
    ContactDetailsComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    WorkExperienceComponent,
    LanguagesComponent,
    AddressComponent,
    AboutMeComponent,
    TenantRegistrationComponent,
    CreateTenantRegistrationComponent,
    ContentAuthoringComponent,
    BackupManagerComponent,
    OfflinePaymentComponent,
    BillingInformationComponent,
    SubjectComponent,
    BlockCopyPasteDirective,
    PollResultsComponent,
    DataDictionaryComponent,
    EventRequestComponent,
    SubscriptionTaskComponent,
    LocationsComponent,
    DetailedAssessmentComponent,
    StudentInformationComponent,
    CourseTrainersDetailsComponent,
    AttendanceDetailsReportComponent,
    CourseInformationReportComponent,
    OnlineExamreportComponent,
    OnlineCoursesReportComponent,
    OnlineCoursesDetailsReportComponent,
    UserReportComponent,
    CoursewiseperformanceReportComponent,
    AssessmentResultComponent,
    TrainingCalendarComponent,
    UploadTemplateComponent,
    MainComponent,
    PageComponent,
    ColorPickerComponent,
    PaintComponent,
    StudentCgpaComponent,
    StudentSGPAReportComponent,
    TreenodeComponent,
    FolderComponent, VisualEditorComponent,
    SemesterComponent,
    StudentAdmissionComponent,
    AddStudentAdmissionComponent,
    NewTeacherComponent,
    AddNewTeacherComponent,
    AcademicYearComponent,
    ComposeMailComponent,
    ViewmailComponent,
    FeesTypeComponent,
    FeeReceivableComponent,
    FeeDescriptionComponent,
    EditFeesComponent,
    CurriculumComponent,
    StudentFeereceivableComponent,
    StudentRegistrationApprovalComponent,
    ContentClassComponent,
    ContentSubjectComponent,
    ContentChapterComponent,
    ContentRepoComponent,
    ContentRepoAddComponent,
    ContentResourcesComponent,
    ContentResourcesComponent,
    BookAllocationReportComponent,
    BookAllocationViewReportComponent,
    StudentsReportComponent,
    FetchAssignedBooksComponent,
    ReturnDateComponent,
    UpdateReturnDateComponent,
    LibraryManagementSystemComponent,
    ListOfBooksComponent,
    LibraryBooksAllocationComponent,
    DepartmentComponent,
    HolidayNotificationComponent,
    ViewNewsComponent,
    ViewDiscussionComponent,
    SamvaadMeetingsComponent,
    CourseComponent,
    ViewCourseComponent,
    TutorHomeComponent,
    TutorSignupComponent,
    TutorLoginComponent,
    FooterNewComponent,
    MainFooterComponent,
    PartnersComponent,
    TestMonialsComponent,
    TrendingCoursesComponent,
    ContactUsComponent,
    ContactUs1Component,
    AllCoursesComponent,
    AllCategoriesComponent,
    AboutUsComponent,
    MainSliderComponent,
    HeaderNewComponent,
    AllCategoryCoursesComponent,
    ChangePasswordComponent,
    ViewCourseDetailsComponent,
    StudentHomeComponent,
    AutocompleteDemoComponent,
    ViewAllDetailsComponent,
    CoursesComponent,
    MyCoursesComponent,
    MyTutorsComponent,
    MyPaymentsComponent,
    TutoreMenuComponent,
    StudentMenuComponent,
    MyReviewComponent,
    EnrolledStudentsComponent,
    TutorPaymentsComponent,
    MyLanguageComponent,
    LevelofLearnerComponent,
    CertificateComponent,
    QrCodeComponent,
    ViewQrcodeComponent,
    TrainerDashboardComponent,
    AccountDetailsComponent,
    IdProofComponent,
    ERPComponent,
    TermsConditionsComponent,
    RefundPolicyComponent,
    PrivacyPolicyComponent,
    PaidInstallmentsComponent,
    ViewProfileComponent,
    ProfileViewCountsComponent,
    UserProfileComponent,
    DataTableComponent,
    AutocompleteOffDirective,
    AdminDashboardComponent,
    ConfigureImagesComponent,
    ApprovalDomainComponent,
    StudentSignupComponent,
    ApproveComponent,
    InvoiceComponent,
    WellcomeRegistraionComponent,
    CompanyRegistrationComponent,
    RecordingScheduleComponent,
    BulletListComponent,
    StudentAddressComponent,
    CourseReportComponent,
    TrainerReportComponent,
    TraineeReportComponent,
    FeeReportComponent,
    ShowFileComponent,
    NotificationComponent,
    LearningResourcesComponent,
    CompanyDetailsComponent,
    AdvertisementsComponent,
    ViewAdsComponent,
    StudentAppliedInternshipsComponent,
    JobListComponent,
    JobAddComponent,
    ApplyJobComponent,
    JobSummeryComponent,
    SubHeaderComponent,
    HeaderJobsComponent,
    HeaderContactsComponent,
    MyJobsComponent,
    JobAppliedLstComponent,
    HeaderInternshipsComponent,
    HeaderCorporatesComponent,
    StartsUpComponent,
    JobsInCompanyLstComponent,
    IncubatorRegComponent,
    InvestorRegComponent,
    StartsUpRegComponent,
    // ApprovalSignupComponent, // DISABLED - Component is commented out
    FounderMenuComponent,
    StartupListComponent,
    IncubatorDashboardComponent,
    InvestorDashboardComponent,
    FounderDashboardComponent,
    IncubatorLstComponent,
    InvestorLstComponent,
    LandingComponent,
    LandingHomeComponent,
    LandingAboutComponent,
    LandingJobsComponent,
    LandingInternsComponent,
    LandingCorporateComponent,
    LandingContactComponent,
    IncubatorProfileComponent,
    InvestorProfileComponent,
    FounderProfileComponent,
    SubscribeComponent,
    IntrenshipLstComponent,
    ResumesListComponent,
    InternshipSummaryComponent,
    ApproveJobsInternshipsComponent,
    StartupProfileComponent,
    PostingJobViewComponent,
    PostingInternshipViewComponent,
    SubscriptionListComponent,
    TooltipDirective,
    JobsMenuComponent,
    InternshipMenuComponent,
    StudentInternshipMenuComponent,
    StudentJobMenuComponent,
    StudentInternshipRecommenderComponent,
    ChatWidgetComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    KncciCoursesComponent,
    PublicCoursesComponent,
    PublicApprenticeshipsComponent,
    PublicInternshipsComponent,
    ApprenticeshipsComponent,
    ApprenticeshipDetailsComponent,
    ApprenticeshipsScheduleComponent,
    ApprenticeshipsApplicationsComponent,
    PublicJobsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    MetismenuAngularModule, PerfectScrollbarModule, AutocompleteLibModule, QRCodeModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, DataTablesModule, CountdownModule, BrowserAnimationsModule, NgxSpinnerModule,
    ToastrModule.forRoot({ preventDuplicates: true }), NgMultiSelectDropDownModule.forRoot(), AngularEditorModule, ChartsModule, DataTablesModule, NgbModule, CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory })
  ],
  providers: [LoginService, httpInterceptorProviders, Resolver, DatePipe, CoursesResolver,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// {provide : LocationStrategy , useClass: HashLocationStrategy}
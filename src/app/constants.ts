export class constants {

    //user registration//
    public isCore: boolean = true;
    public static GetRolesByTenantCode: string = 'Registration/GetRolesByTenantCode';
    public static UserRolesChange: string = 'Registration/UserRolesChange';
    public static GetTenantByRoleId: string = 'Registration/GetTenantByRoleId';
    public static GetRegistrationTitle: string = 'Registration/GetRegistrationTitle';
    public static GetTitle: string = 'GetTitle';
    public static GetGender: string = 'GetGender';
    public static SaveRegistration: string = 'Registration/SaveRegistration';
    public static EditRegistrationByUserId: string = 'Registration/EditRegistrationByUserId';
    public static EditRegistration: string = 'Registration/EditRegistration';
    public static GetMarriageStatus: string = 'GetMarriageStatus';
    public static GetBranch: string = 'GetBranch';
    public static GetLoadYear: string = 'Registration/GetLoadYear';
    public static GetEducationGroup: string = 'Registration/GetEducationGroup';
    public static GetEducationName: string = 'Registration/GetEducationName';
    public static GetProjectLocationType: string = 'GetProjectLocationType';
    public static GetProjectLocation: string = 'GetProjectLocation';
    public static GetEmployementType: string = 'GetEmployementType';
    public static GetEmployementStatus: string = 'GetEmployementStatus';
    public static GetLanguage: string = 'GetLanguage';
    public static GetProficiencyLevel: string = 'GetProficiencyLevel';
    public static GetAddressType: string = 'GetAddressType';
    public static GetCountry: string = 'GetCountry';
    public static GetStateByCountryId: string = 'GetStateByCountryId';
    public static GetCityByStateId: string = 'GetCityByStateId';
    public static UpdateRegistration: string = 'Registration/UpdateRegistration';
    public static UploadUserImage: string = 'Registration/UploadUserImage';
    public static AddRegistration: string = 'Registration/AddRegistration';


    ////tenant registration////
    public static LoadTenantByRoleId: string = 'TenantRegistration/GetList';
    public static EditTenant: string = 'TenantRegistration/Get';
    public static SaveTenant: string = 'TenantRegistration/Create';
    public static UpdateTenant: string = "TenantRegistration/Update";
    public static UploadTenant: string = 'TenantRegistration/UploadTenant';

    //// content authoring 
    public static LoadContentAuthoring: string = 'ContentAuthoring/GetList';
    public static AddContentAuthoring: string = 'ContentAuthoring/Create';
    public static EditContentAuthoring: string = 'ContentAuthoring/Get';
    public static ModifyContentAuthoring: string = 'ContentAuthoring/Update';
    public static RemoveContentAuthoring: string = 'ContentAuthoring/Delete';

    ////backup Manager
    public static LoadMaterials: string = 'BackupManager/LoadMaterials';
    public static LoadArchiveMaterials: string = 'BackupManager/LoadArchiveMaterials';
    public static ArchiveMaterial: string = 'BackupManager/ArchiveMaterial';
    public static RollbackMaterial: string = 'BackupManager/RollbackMaterial'

    /// offline Payment
    public static LoadOfflinePayment: string = 'OfflinePayment/LoadOfflinePayment';
    public static GetSubscriptionType: string = 'OfflinePayment/GetSubscriptionType';
    public static DeactivateSubscription: string = 'OfflinePayment/DeactivateSubscription';
    public static UploadSubscriberImage: string = 'OfflinePayment/UploadSubscriberImage';
    public static AssignPayment: string = 'OfflinePayment/AssignPayment';
    public static GetSystemTimeZones: string = 'OfflinePayment/GetSystemTimeZones';
    public static ProceedPayment: string = 'OfflinePayment/ProceedPayment';

    // subject
    public static GetSubjects: string = "Subject/GetSubjects";
    public static LoadSubjects: string = 'Subject/GetList' || 'LoadSubjects';
    public static EditSubjects: string = "Subject/Get" || 'EditSubjects';
    public static UpdateSubjects: string = "Subject/Update" || 'UpdateSubjects';
    public static CreateSubjects: string = "Subject/Create" || 'CreateSubjects';

    // polls
    public static loadpoll: string = 'Poll/loadpoll';
    public static Createpoll: string = 'Poll/Createpoll';
    public static Updatepoll: string = 'Poll/Updatepoll';
    public static Displaychart: string = 'Poll/Displaychart';
    public static Editpoll: string = 'Poll/Editpoll';
    public static deletepoll: string = 'Poll/deletepoll';

    //s polls
    public static Getpolls: string = 'Poll/Getpolls';
    public static GetPollQuestions: string = 'Poll/GetPollQuestions';
    public static SavePolls: string = 'Poll/SavePolls';


    //surveys
    public static loadSurvey: string = 'Survey/loadSurvey';
    public static deleteSurvey: string = 'Survey/deleteSurvey';
    public static PublishSurvey: string = 'Survey/PublishSurvey';
    public static EditSurvey: string = 'Survey/EditSurvey';
    public static UpdateSurvey: string = 'Survey/UpdateSurvey';
    public static CreateSurvey: string = 'Survey/CreateSurvey';

    public static loadSurveyQuestionnaire: string = 'Survey/loadSurveyQuestionnaire';
    public static CreateSurveyQuestionnaire: string = 'Survey/CreateSurveyQuestionnaire';
    public static UpdateSurveyQuestionnaire: string = 'Survey/UpdateSurveyQuestionnaire';
    public static deleteSurveyQuestionnaire: string = 'Survey/deleteSurveyQuestionnaire';
    public static EditSurveyQuestionnaire: string = 'Survey/EditSurveyQuestionnaire';

    //Feedback
    public static loadFeedbackQuestionnaire: string = 'Feedback/LoadFeedbackQuestionnaire';
    public static SaveFeedbackQuestionnaire: string = 'Feedback/SaveFeedbackQuestionnaire';
    public static updateFeedbackQuestionnaire: string = 'Feedback/updateFeedbackQuestionnaire';
    public static EditFeedbackQuestionnaire: string = 'Feedback/EditFeedbackQuestionnaire';
    public static LoadUsers: string = 'Feedback/LoadUsers';
    public static LoadGrid: string = 'Feedback/LoadGrid';

    // Attainment Level
    public static Loadattainmentgrid: string = 'AttainmentLevel/GetList' || 'Loadattainmentgrid';
    public static Editattainmentgrid: string = 'AttainmentLevel/Get' || 'Editattainmentgrid';
    public static Createattainmentgrid: string = 'AttainmentLevel/Create' || 'Createattainmentgrid';
    public static Updateattainmentgrid: string = 'AttainmentLevel/Update' || 'Updateattainmentgrid';

    //FAQS
    public static LoadDisplayFAQs: string = 'FAQ/GetList';
    public static CreateDisplayFAQs: string = 'FAQ/Create';
    public static UpdateDisplayFAQs: string = 'FAQ/Update';
    public static deleteDisplayFAQs: string = 'FAQ/Delete';
    public static editDisplayFAQs: string = 'FAQ/Get';

    // create News  
    public static LoadCreateNews: string = 'News/GetList';
    public static CreateNewssave: string = 'News/Create';
    public static CreateNewsUpdate: string = 'News/Update';
    public static deletecreatenews: string = 'News/Delete';
    public static editcreatenews: string = 'News/Get';
    public static UploadFiles: string = 'News/UploadFiles';
    public static UploadNews: string = 'News/UploadNews';

    //SMTP
    public static LoadSMTP: string = 'SMTP/GetList';
    public static CreateSMTP: string = 'SMTP/Create';
    public static UpdateSMTP: string = 'SMTP/Update';
    public static EditSMTP: string = 'SMTP/Get';

    // Task Manager
    public static LoadTaskManager: string = 'TaskManager/GetList';
    public static CreateTaskManager: string = 'TaskManager/Create';
    public static UpdateTaskManager: string = 'TaskManager/Update';
    public static BindParentTask: string = 'TaskManager/BindParentTask';
    public static editTaskmanager: string = 'TaskManager/Get';

    // Course Category
    public static LoadCourseCategory: string = 'CourseCategory/GetList';
    public static CreateCourseCategory: string = 'CourseCategory/Create';
    public static UpdateCourseCategory: string = 'CourseCategory/Update';
    public static EditCourseCategory: string = 'CourseCategory/Get';

    //Added by Uma Mahesh
    public static GetAllCategories: string = 'CourseCategory/GetAllCategories';
    public static GetAllCoursesByCategoryId: string = 'CourseSchedule/GetAllCoursesByCategoryId';
    public static GetAllActiveCoursesByCategoryId: string = 'CourseSchedule/GetAllActiveCoursesByCategoryId';
    public static GetAllCoursesByTrending: string = 'CourseSchedule/GetAllCoursesByTrending';
    public static GetSessionsByCourseId: string = 'CourseSchedule/GetSessionsByCourseId';

    // Course Type
    public static LoadCourseType: string = 'CourseType/GetList';
    public static CreateCourseType: string = 'CourseType/Create';
    public static UpdateCourseType: string = 'CourseType/Update';
    public static EditCourseType: string = 'CourseType/Get';

    // Courses
    public static LoadCourse: string = 'Courses/GetList';
    public static CreateCourse: string = 'Courses/Create';
    public static UpdateCourse: string = 'Courses/Update';
    public static EditCourse: string = 'Courses/Get';
    public static GetCourses: string = 'Courses/GetCourses';
    public static GetAdminCourses: string = 'Courses/GetAdminCourses';
    public static DashboardCounts: string = 'Courses/DashboardCounts/';
    public static UpdateMoreOptions: string = 'Courses/UpdateMoreOptions';

    //  public static LoadCourseCategory: string = 'LoadCourseCategory'
    public static LoadAssignTrainerByCourseId: string = 'CourseTrainer/GetList';
    public static CreateAssignTrainerByCourseId: string = 'CourseTrainer/Create';
    public static UpdateAssignTrainerByCourseId: string = 'CourseTrainer/Update';
    public static LoadProgramOutcomeByCourseId: string = 'ProgramOutcome/GetList';
    public static EditProgramOutcomeByCourseId: string = 'ProgramOutcome/Get';
    public static CreateProgramOutcomeByCourseId: string = 'ProgramOutcome/Create';
    public static UpdateProgramOutcomeByCourseId: string = 'ProgramOutcome/Update';
    public static GetCourseTrainer: string = 'CourseTrainer/GetCourseTrainer';

    // Regulations
    public static BindTenants: string = 'Regulations/BindTenants';
    public static Loadregulationsgrid: string = 'Regulations/GetList';
    public static Createregulationsgrid: string = 'Regulations/Create';
    public static Updateregulationsgrid: string = 'Regulations/Update';
    public static Editregulationsgrid: string = 'Regulations/Get';

    //Enroll
    public static Loadcourses: string = 'Loadcourses';
    public static LoadCourseSchedule: string = 'LoadCourseSchedule';
    public static Loadyear: string = 'Enroll/Loadyear';
    public static loadstudents: string = 'Enroll/loadstudents';
    public static CreateEnroll: string = 'Enroll/CreateEnroll';

    //Chapters
    public static LoadChapterCourse: string = 'Chapters/LoadChapterCourse';
    public static LoadchapterCourseSchedule: string = 'Chapters/LoadchapterCourseSchedule';
    public static Loadchaptercourseobjective: string = 'Chapters/Loadchaptercourseobjective';
    public static LoadchapterGrid: string = 'Chapters/GetList';
    public static EditChapters: string = 'Chapters/Get';
    public static CreateChapters: string = 'Chapters/Create';
    public static updateChapters: string = 'Chapters/update';
    public static assignPO_COViewChapters: string = 'Chapters/assignPO_COViewChapters'//COPO/GetList';
    public static CreateCOPO: string = 'COPO/Create';
    public static getChaptersByCourseId: string = 'Chapters/getChaptersByCourseId';

    //Configure Material
    public static LoadChaptersByCourseSchedule: string = 'Chapters/LoadChaptersByCourseSchedule';
    public static LoadMaterialsByChapter: string = 'ConfigureMaterial/LoadMaterialsByChapter';
    public static SaveConfigureMaterial: string = 'ConfigureMaterial/SaveConfigureMaterial';
    public static PostAssessmentCheck: string = 'ConfigureMaterial/PostAssessmentCheck';

    //Content Manager
    public static LoadContentManager: string = "ContentManager/GetList";
    public static EditContentManager: string = 'ContentManager/Get'
    public static DeleteContentManager: string = 'ContentManager/Delete';
    public static CreateContentManager: string = 'ContentManager/Create';
    public static UpdateContentManager: string = 'ContentManager/Update';
    public static UploadMaterial: string = 'ContentManager/UploadMaterial';

    //Assessment Questionaire
    public static GetLevelofDifficulty: string = 'AssessmentQuestionarie/GetLevelofDifficulty';//get call
    public static UploadAssessmentQuestionaries: string = 'AssessmentQuestionarie/UploadAssessmentQuestionaries';
    public static LoadAssessmentQuestionaries: string = 'AssessmentQuestionarie/LoadAssessmentQuestionaries';
    public static EditAssessmentQuestionaries: string = 'AssessmentQuestionarie/EditAssessmentQuestionaries';
    public static CreateAssessmentQuestionaries: string = 'AssessmentQuestionarie/CreateAssessmentQuestionaries';
    public static UpdateAssessmentQuestionaries: string = 'AssessmentQuestionarie/UpdateAssessmentQuestionaries';
    public static CourseObjectiveByCourseId: string = 'Courses/CourseObjectiveByCourseId';
    public static GetChaptersByCourseId: string = 'Chapters/GetChaptersByCourseId';

    //Master Assessment
    public static GetCourseCategory: string = 'CourseCategory/GetCourseCategory';
    public static GetCourseByCourseCategoryId: string = 'Courses/GetCourseByCourseCategoryId';
    public static LoadMasterAssessment: string = 'MasterAssessment/GetList';
    public static EditMasterAssessment: string = 'MasterAssessment/Get';
    public static UpdateMasterAssessment: string = 'MasterAssessment/Update';
    public static CreateMasterAssessment: string = 'MasterAssessment/Create';
    public static CheckComplexityData: string = 'MasterAssessment/CheckComplexityData';


    // Schedule Assessment 
    public static LoadScheduleAssessment: string = 'ScheduleAssessment/GetList';
    public static EditScheduleAssessment: string = 'ScheduleAssessment/Get';
    public static CreateScheduleAssessment: string = 'ScheduleAssessment/Create';
    public static UpdateScheduleAssessment: string = 'ScheduleAssessment/Update';
    public static GetAssessmentByCourseSchedule: string = 'ScheduleAssessment/GetAssessmentByCourseSchedule';

    //Course  Schedule batch plan

    public static GetCourseByRoleId: string = 'GetCourseByRoleId';
    public static GetCountryByKey: string = 'GetCountryByKey';
    public static GetAcadamicYearByKey: string = 'GetAcadamicYearByKey';
    public static GetCourseYearByKey: string = 'GetCourseYearByKey';
    public static GetSemesterByKey: string = 'GetSemesterByKey';
    public static GetSubjectByKey: string = 'GetSubjectByKey';
    public static GetSectionsByKey: string = 'GetSectionsByKey';
    public static GetRegulations: string = 'CourseSchedule/GetRegulations' //get call
    public static LoadCourseScheduleBatchPlan: string = 'CourseSchedule/GetList';
    public static EditCourseScheduleBatchPlan: string = 'CourseSchedule/Get';
    public static GetLocations: string = 'CourseSchedule/GetLocations';
    public static GetRoomsByLocation: string = 'CourseSchedule/GetRoomsByLocation';
    public static GetNumberofSeatsByRoom: string = 'CourseSchedule/GetNumberofSeatsByRoom';
    public static CreateCourseScheduleBatchPlan: string = 'CourseSchedule/Create';
    public static UpdateCourseScheduleBatchPlan: string = 'CourseSchedule/Update';
    public static GetTrainers: string = 'CourseSchedule/GetTrainers';
    public static LoadAssignTrainers: string = 'CourseSchedule/LoadAssignTrainers';
    public static UpdateAssignTrainers: string = 'CourseSchedule/UpdateAssignTrainers';
    public static CreateAssignTrainers: string = 'CourseSchedule/CreateAssignTrainers';
    public static GetCourseType: string = 'CourseSchedule/GetCourseType';
    public static LoadUsersByCourseScheduleId: string = 'CourseSchedule/LoadUsersByCourseScheduleId';
    public static GetNoOfSessionsByCourseId: string = 'CourseSchedule/GetNoOfSessionsByCourseId';
    public static GetEndDateByCourseId: string = 'CourseSchedule/GetEndDateByCourseId';
    public static EditAssignTrainers: string = 'CourseSchedule/EditAssignTrainers';

    //Rooms
    public static LoadRooms: string = 'Room/GetList';
    public static EditRooms: string = 'Room/Get';
    public static CreateRooms: string = 'Room/Create';
    public static UpdateRooms: string = 'Room/Update';

    //Attendance Details 
    public static GetSessionByCourseScheduleId: string = 'Attendance/GetSessionByCourseScheduleId';
    public static GetAttendanceByCourseScheduleId: string = 'Attendance/GetAttendanceByCourseScheduleId';
    public static SaveAttendanceDetails: string = 'Attendance/SaveAttendanceDetails';

    //menu
    public static LoadMenusByRoleId: string = 'LoadMenusByRoleId';

    //Roles
    public static AddRole: string = 'Role/AddRole';
    public static EditRole: string = 'Role/EditRole';
    public static LoadRoles: string = 'Role/LoadRoles';
    public static UpdateRole: string = 'Role/UpdateRole';

    //Task in Role
    public static SaveAssignTasks: string = 'Role/SaveAssignTasks';
    public static GetRolesByTenant: string = 'Role/GetRolesByTenant';
    public static GetAvaliableAndAssignedTask: string = 'Role/GetAvaliableAndAssignedTask';

    //Forum 
    public static LoadFourm: string = 'Forums/LoadFourm';
    public static AddTopic: string = 'Forums/Create';
    public static UploadTopicFiles: string = 'Forums/UploadTopicFiles';

    //ForumTopics
    public static LoadFourmTopics: string = 'Forums/GetList';
    public static EditTopic: string = 'Forums/Get';
    public static RemoveTopic: string = 'Forums/Delete';
    public static UpdateTopic: string = 'Forums/Update';

    //My Posts
    public static LoadpublishedPosts: string = 'Blogs/LoadpublishedPosts';
    public static LoadDrafts: string = 'Blogs/LoadDrafts';
    public static UploadBlogFiles: string = 'Blogs/UploadBlogFiles';
    public static EditBlog: string = 'Blogs/EditBlog';
    public static ViewBlog: string = 'Blogs/ViewBlog';
    public static LoadComments: string = 'Blogs/LoadComments';
    public static MyPostSearch: string = 'Blogs/MyPostSearch';
    public static SaveBlog: string = 'Blogs/SaveBlog';
    public static PublishBlog: string = 'Blogs/PublishBlog';
    public static RemoveBlog: string = 'Blogs/RemoveBlog';
    public static LoadPendingBlogs: string = 'Blogs/LoadPendingBlogs';
    public static LoadDeclineBlogs: string = 'Blogs/LoadDeclineBlogs';
    public static AddComment: string = 'Blogs/AddComment';
    public static ReplyToComment: string = 'Blogs/ReplyToComment';
    public static DeleteComment: string = 'Blogs/DeleteComment';

    //Blogs
    public static PopularBlogs: string = 'Blogs/PopularBlogs';
    public static BlogSearch: string = 'Blogs/BlogSearch';
    public static PublishNewPost: string = 'Blogs/PublishNewPost';
    public static ComposeNewPost: string = 'Blogs/ComposeNewPost';

    public static LoadAllBlogs: string = 'Blogs/LoadAllBlogs';
    public static AllBlogsSearch: string = 'Blogs/AllBlogsSearch';

    public static LoadApprovelBlogs: string = 'Blogs/LoadApprovelBlogs';
    public static ApproveBlog: string = 'Blogs/ApproveBlog';
    public static DeclineBlog: string = "Blogs/DeclineBlog";

    //course sessions
    public static GetCourseScheduleSession: string = 'CourseSchedule/GetCourseScheduleSession';
    public static SetCourseScheduleSessions: string = 'CourseSchedule/SetCourseScheduleSessions';
    public static LoadCourseScheduleSession: string = 'CourseSchedule/LoadCourseScheduleSession';

    //join confirence
    public static VCDetails: string = 'AVService/VCDetails';
    // Learning material
    public static LearningMeterials: string = 'LearningMeterial/LearningMeterials';
    public static TrackMaterialTime: string = 'LearningMeterial/TrackMaterialTime';

    // assessment  Take exam 
    public static GetAssessment: string = 'Assessment/GetAssessment';
    public static SetAssessments: string = 'Assessment/SetAssessments';
    public static CheckAnswers: string = 'Assessment/CheckAnswers';
    public static StudentAssessementResult: string = 'Assessment/StudentAssessementResult';
    public static LoadAssessmentDropdown: string = 'Assessment/LoadAssessmentDropdown';
    public static GetAssessmentTime: string = 'Assessment/GetAssessmentTime';
    public static GetAssessmentUsers: string = 'Assessment/GetAssessmentUsers';
    public static GetAssessmentAnswers: string = 'Assessment/GetAssessmentAnswers';
    public static SetEvaluateAssessments: string = 'Assessment/SetEvaluateAssessments';
    public static ListOfAssessments: string = 'Assessment/ListOfAssessments';
    public static GetAssessmentTypes = 'Assessment/GetAssessmentTypes'
    //Assignments
    public static LoadAssignments: string = 'Assignments/GetList';
    public static GetAssignmentsById: string = 'Assignments/GetAssignmentsById';
    public static LoadEvaluateAssignments: string = 'Assignments/LoadEvaluateAssignments';
    public static SetAssignments: string = 'Assignments/Create';
    public static updateAssignments: string = 'Assignments/Update';
    public static SetEvaluateAssignments: string = 'Assignments/SetEvaluateAssignments';
    public static GetAssignments: string = 'Assignments/GetAssignments';
    // submit Assignments
    public static StudentAssingments: string = 'Assignments/StudentAssingments';
    public static SubmitAssignments: string = 'SubmitAssignments';

    public static UploadAssignment: string = 'Assignments/UploadAssignment';
    //surveys
    public static GetSurveys: string = 'Survey/GetSurveys';
    public static GetSurveyQuestions: string = 'Survey/GetSurveyQuestions';
    public static SetSurveys: string = 'Survey/SetSurveys';


    //time tracker
    public static TimeTracker: string = 'LearningMeterial/TimeTracker';

    //LoadDashboard
    public static LoadDashboard: string = 'LoadDashboard';


    //dropdowns
    public static GetCourseSchedule: string = 'CourseSchedule/GetCourseSchedule';
    public static GetAdminCourseSchedule: string = 'CourseSchedule/GetAdminCourseSchedule';


    //data dictionary
    public static LoadDataDictionary: string = 'DataDictionary/GetList';
    public static EditDataDictionary: string = 'DataDictionary/Get';
    public static GetDictionaryValues: string = 'DataDictionary/GetDictionaryValues';
    public static GetDictionaryByKey: string = 'DataDictionary/GetDictionaryByKey';
    public static GetGroupDictionary: string = 'DataDictionary/GetGroupDictionary';
    public static GetParentDictionary: string = 'DataDictionary/GetParentDictionary';
    public static CreateDataDictionary: string = 'DataDictionary/Create';
    public static UpdateDataDictionary: string = 'DataDictionary/Update';
    public static GetChildDictionary: string = 'DataDictionary/GetChildDictionary';
    //event requets

    public static LoadEvent: string = 'EventRequest/GetList';
    public static EditEvent: string = 'EventRequest/Get';
    public static CreateEvent: string = 'EventRequest/Create';
    public static UpdateEvent: string = 'EventRequest/Update';

    //subscription tasl
    public static SubscriptionTypes: string = 'SubscriptionTasks/SubscriptionTypes';
    public static GetSubscriptionValues: string = 'SubscriptionTasks/GetSubscriptionValues';
    public static save: string = 'SubscriptionTasks/Post';

    //locations
    public static loadLocation: string = 'Location/GetList';
    public static EditLocation: string = 'Location/Get';
    public static CreateLocation: string = 'Location/Create';
    public static UpdateLocation: string = 'Location/Update';

    //exam result
    public static GetStudentResult: string = 'ExamResults/GetStudentResult';
    public static ProgressReport: string = 'ExamResults/ProgressReport'; //
    public static SetStudentResult: string = 'ExamResults/SetStudentResult';

    //lession plan
    public static SaveLessionPlan: string = 'LessionPlan/SaveLessionPlan';

    //account
    public static GetStudents: string = 'Account/GetStudents';
    public static usersbycourseShedule: string = 'Account/usersbycourseShedule';

    //assessmentresult
    public static GetAssessmentResult: string = 'AssessmentResult/GetList';
    public static UpdateAssessmentResult: string = 'AssessmentResult/UpdateAssessmentResult';

    //reports
    public static RPT_CERTIFICATE: string = 'Reports/RPT_CERTIFICATE';
    public static USP_RPT_KHITREPORT: string = 'Reports/USP_RPT_KHITREPORT';
    public static RPT_COURSEDETAILS: string = 'Reports/RPT_COURSEDETAILS';
    public static RPT_COURSETRAINERSDETAILS: string = 'Reports/RPT_COURSETRAINERSDETAILS';
    public static USP_RPT_COURSEPERFFORMANCEREPORT: string = 'Reports/USP_RPT_COURSEPERFFORMANCEREPORT';
    public static RPT_DETAILEDASSESSMENTREPORT: string = 'Reports/RPT_DETAILEDASSESSMENTREPORT';
    public static OnlineCoursesReport: string = 'Reports/OnlineCoursesReport';
    public static RPT_ONLINEEXAMQUESTIONS: string = 'Reports/RPT_ONLINEEXAMQUESTIONS';
    public static RPT_DLC_STUDENT_ATTENDANCE: string = 'Reports/RPT_DLC_STUDENT_ATTENDANCE';
    public static RPT_STUDENT_INFORMATION: string = 'Reports/RPT_STUDENT_INFORMATION';
    public static USP_RPT_STUDENTPERFORMANCE: string = 'Reports/USP_RPT_STUDENTPERFORMANCE';


    //
    public static ExcelUpload: string = 'ExcelUpload/TemplateType';

}
export class acess {
    public isCore: boolean = true;
}
export type Language = "vi" | "en" | "fr" | "de";

export interface TranslationSchema {
  // Navigation & Header
  today: string;
  timetable: string;
  courses: string;
  settings: string;
  addClass: string;
  quickAdd: string;
  signOut: string;
  signIn: string;
  getStarted: string;
  currentTerm: string;

  // Landing Page
  heroTitle: string;
  heroSubtitle: string;
  startFree: string;
  demoNote: string;
  whatDemuseDoes: string;
  whatDemuseDoesSub: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  ctaTitle: string;
  ctaSub: string;
  ctaButton: string;

  // Next Class Hero & Dashboard
  goodDay: string;
  classInSession: string;
  upNext: string;
  allClassesFinished: string;
  noClassesToday: string;
  welcomeToDemuse: string;
  noClassesScheduledYet: string;
  addSubjectsPrompt: string;
  viewFullWeek: string;
  addFirstClass: string;
  room: string;

  // Today Timeline
  todaysSchedule: string;
  sessionCount: string;
  noClassesScheduledToday: string;
  enjoyFreeTime: string;
  addClassForToday: string;

  // Weekly Workload & Info Card
  weeklyWorkload: string;
  workloadSub: string;
  openPlanner: string;
  activeTimetable: string;
  coursesEnrolled: string;
  weeklySessions: string;
  publicBadge: string;
  privateBadge: string;
  offDay: string;

  // Timetable Page
  filterPlaceholder: string;
  fullWeek7Days: string;
  workDays5Days: string;
  share: string;
  addCourse: string;
  noClassesOnDay: string;
  freeDayMessage: string;
  clickToAdd: string;
  confirmDeleteClass: string;

  // Courses / Subjects Page
  courseCatalog: string;
  courseCatalogSub: string;
  noCoursesYet: string;
  noCoursesSub: string;
  addNewCourse: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  defaultRoom: string;
  colorTheme: string;
  notesSyllabus: string;
  editCourse: string;
  editDetails: string;
  saveChanges: string;
  createCourse: string;
  cancel: string;
  confirmDeleteCourse: string;

  // Settings Page
  preferencesSettings: string;
  settingsSub: string;
  studentProfile: string;
  fullName: string;
  emailAddress: string;
  emailHelper: string;
  saveProfile: string;
  profileSaved: string;
  securityPassword: string;
  currentPassword: string;
  newPassword: string;
  updatePassword: string;
  passwordSaved: string;
  classNotificationAlerts: string;
  upcomingClassReminders: string;
  upcomingRemindersSub: string;
  leadTimeLabel: string;
  soundAlert: string;
  soundAlertSub: string;
  testPhonePopup: string;
  savePreferences: string;
  preferencesSaved: string;
  iphoneTipTitle: string;
  iphoneTipBody: string;
  timetableDetails: string;
  timetableTitle: string;
  academicTerm: string;
  departmentDesc: string;
  saveTimetable: string;

  // Share Modal
  shareTimetable: string;
  shareTimetableDesc: string;
  publicLinkActive: string;
  privateTimetable: string;
  publicLinkHelp: string;
  privateLinkHelp: string;
  shareableLink: string;
  copyLink: string;
  copied: string;
  resetLink: string;
  turnOnPublic: string;
  done: string;

  // Class Form Modal
  addNewClass: string;
  configureClassTiming: string;
  selectExistingCourse: string;
  orAddNewCourse: string;
  daysOfWeekLabel: string;
  startTime: string;
  endTime: string;
  classType: string;
  roomVenue: string;
  timeConflictWarning: string;
  createScheduleBtn: string;
  saveScheduleBtn: string;

  // Days of Week
  days: {
    mon: { short: string; full: string; letter: string };
    tue: { short: string; full: string; letter: string };
    wed: { short: string; full: string; letter: string };
    thu: { short: string; full: string; letter: string };
    fri: { short: string; full: string; letter: string };
    sat: { short: string; full: string; letter: string };
    sun: { short: string; full: string; letter: string };
  };

  // Footer
  footerDesc: string;
  product: string;
  createAccount: string;
  security: string;
  httpOnly: string;
  encrypted: string;
  isolation: string;
  rights: string;
}

export const translations: Record<Language, TranslationSchema> = {
  vi: {
    today: "Hôm nay",
    timetable: "Thời khóa biểu",
    courses: "Môn học",
    settings: "Cài đặt",
    addClass: "Thêm tiết",
    quickAdd: "Thêm tiết nhanh",
    signOut: "Đăng xuất",
    signIn: "Đăng nhập",
    getStarted: "Bắt đầu",
    currentTerm: "Học kỳ hiện tại",

    heroTitle: "Quản lý thời khóa biểu và lịch học cá nhân.",
    heroSubtitle: "Theo dõi lịch học, phòng học, đếm ngược thời gian đến tiết tiếp theo và tự động phát hiện trùng giờ.",
    startFree: "Bắt đầu miễn phí",
    demoNote: "Công cụ quản lý thời khóa biểu trực quan, rõ ràng cho học sinh và sinh viên.",
    whatDemuseDoes: "Tính năng chính",
    whatDemuseDoesSub: "Tập trung vào những công cụ cần thiết để quản lý lịch học hàng tuần.",
    feature1Title: "Đếm ngược tiết học",
    feature1Desc: "Hiển thị thông tin phòng học, giảng viên và thời gian còn lại đến tiết tiếp theo.",
    feature2Title: "Phát hiện trùng lịch",
    feature2Desc: "Hệ thống tự động thông báo khi có hai tiết học bị trùng khung giờ.",
    feature3Title: "Thông báo trên điện thoại",
    feature3Desc: "Nhắc nhở trước giờ học trên iPhone, Android và trình duyệt máy tính.",
    feature4Title: "Chia sẻ lịch học",
    feature4Desc: "Tạo liên kết chỉ xem để gửi thời khóa biểu cho bạn bè hoặc nhóm học tập.",
    ctaTitle: "Bắt đầu sắp xếp lịch học của bạn",
    ctaSub: "Đăng ký tài khoản để tạo và quản lý thời khóa biểu học kỳ.",
    ctaButton: "Tạo tài khoản miễn phí",

    goodDay: "Xin chào",
    classInSession: "Đang trong giờ học",
    upNext: "Tiết tiếp theo",
    allClassesFinished: "Đã hoàn thành các tiết học hôm nay",
    noClassesToday: "Hôm nay không có tiết học nào",
    welcomeToDemuse: "Chào mừng bạn đến với Demuse",
    noClassesScheduledYet: "Chưa có tiết học nào được lên lịch",
    addSubjectsPrompt: "Thêm môn học để bắt đầu theo dõi lịch học hàng ngày.",
    viewFullWeek: "Xem cả tuần",
    addFirstClass: "Thêm tiết đầu tiên",
    room: "Phòng",

    todaysSchedule: "Lịch học hôm nay",
    sessionCount: "buổi học được lên lịch hôm nay",
    noClassesScheduledToday: "Hôm nay không có tiết học nào",
    enjoyFreeTime: "Bạn có thể nghỉ ngơi hoặc xem trước bài tập của các ngày tiếp theo.",
    addClassForToday: "Thêm tiết học hôm nay",

    weeklyWorkload: "Tổng quan tuần",
    workloadSub: "Tổng quan các buổi học trong tuần",
    openPlanner: "Mở thời khóa biểu",
    activeTimetable: "Thời khóa biểu hiện tại",
    coursesEnrolled: "môn học đã thêm",
    weeklySessions: "buổi học / tuần",
    publicBadge: "Công khai",
    privateBadge: "Riêng tư",
    offDay: "Nghỉ",

    filterPlaceholder: "Tìm kiếm môn học, giảng viên, phòng...",
    fullWeek7Days: "7 ngày (Cả tuần)",
    workDays5Days: "5 ngày (Thứ 2 – Thứ 6)",
    share: "Chia sẻ",
    addCourse: "Thêm môn học",
    noClassesOnDay: "Không có tiết học",
    freeDayMessage: "Lịch của bạn trống vào ngày này. Bấm bên dưới để thêm môn học.",
    clickToAdd: "Bấm để thêm",
    confirmDeleteClass: "Bạn có chắc chắn muốn xóa tiết học này khỏi thời khóa biểu?",

    courseCatalog: "Danh mục Môn học",
    courseCatalogSub: "Quản lý danh sách môn học, giảng viên, phòng học và màu sắc",
    noCoursesYet: "Chưa có môn học nào",
    noCoursesSub: "Thêm môn học đầu tiên để bắt đầu xây dựng thời khóa biểu của bạn.",
    addNewCourse: "Thêm môn học mới",
    courseName: "Tên môn học",
    courseCode: "Mã môn học",
    instructor: "Giảng viên / Giáo viên",
    defaultRoom: "Phòng học mặc định",
    colorTheme: "Màu sắc hiển thị",
    notesSyllabus: "Ghi chú / Đề cương",
    editCourse: "Chỉnh sửa Môn học",
    editDetails: "Chỉnh sửa chi tiết →",
    saveChanges: "Lưu thay đổi",
    createCourse: "Tạo môn học",
    cancel: "Hủy",
    confirmDeleteCourse: "Bạn có chắc chắn muốn xóa môn học này? Tất cả các tiết học liên quan cũng sẽ bị xóa.",

    preferencesSettings: "Cài đặt & Tùy chọn",
    settingsSub: "Quản lý thông tin tài khoản, thời khóa biểu và thông báo nhắc nhở",
    studentProfile: "Hồ sơ Người dùng",
    fullName: "Họ và tên",
    emailAddress: "Địa chỉ Email",
    emailHelper: "Email được liên kết cố định với tài khoản đăng nhập.",
    saveProfile: "Lưu hồ sơ",
    profileSaved: "Đã lưu hồ sơ thành công",
    securityPassword: "Bảo mật & Mật khẩu",
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    updatePassword: "Cập nhật mật khẩu",
    passwordSaved: "Đã đổi mật khẩu thành công",
    classNotificationAlerts: "Thông báo Nhắc giờ học",
    upcomingClassReminders: "Nhắc nhở trước giờ học",
    upcomingRemindersSub: "Nhận thông báo trước khi mỗi tiết học bắt đầu",
    leadTimeLabel: "Thời gian nhắc trước mặc định",
    soundAlert: "Âm thanh thông báo",
    soundAlertSub: "Phát chuông nhẹ khi có thông báo",
    testPhonePopup: "Thử thông báo điện thoại",
    savePreferences: "Lưu tùy chọn",
    preferencesSaved: "Đã lưu tùy chọn thông báo",
    iphoneTipTitle: "📱 Mẹo cho người dùng iPhone / iOS:",
    iphoneTipBody: "Trên iPhone (iOS 16.4+), mở Safari → bấm nút Chia sẻ (hình vuông có mũi tên) → chọn \"Thêm vào Màn hình chính\". Mở Demuse từ Màn hình chính để nhận thông báo đẩy.",
    timetableDetails: "Thông tin Thời khóa biểu",
    timetableTitle: "Tên Thời khóa biểu",
    academicTerm: "Học kỳ / Năm học",
    departmentDesc: "Mô tả / Ngành học",
    saveTimetable: "Lưu thông tin",

    shareTimetable: "Chia sẻ Thời khóa biểu",
    shareTimetableDesc: "Tạo liên kết công khai an toàn cho bạn bè hoặc nhóm học tập.",
    publicLinkActive: "Liên kết công khai đang bật",
    privateTimetable: "Thời khóa biểu riêng tư",
    publicLinkHelp: "Bất kỳ ai có đường dẫn đều có thể xem thời khóa biểu ở chế độ chỉ đọc.",
    privateLinkHelp: "Chỉ bạn mới có thể xem thời khóa biểu này.",
    shareableLink: "Đường dẫn chia sẻ",
    copyLink: "Sao chép link",
    copied: "Đã chép",
    resetLink: "Đổi mã liên kết mới",
    turnOnPublic: "Bật chế độ công khai để tạo liên kết chia sẻ.",
    done: "Xong",

    addNewClass: "Thêm Tiết học",
    configureClassTiming: "Thiết lập môn học, thời gian và phòng học trong tuần.",
    selectExistingCourse: "Chọn môn học có sẵn",
    orAddNewCourse: "Hoặc tạo môn học mới",
    daysOfWeekLabel: "Ngày học trong tuần",
    startTime: "Giờ bắt đầu",
    endTime: "Giờ kết thúc",
    classType: "Loại hình buổi học",
    roomVenue: "Phòng học",
    timeConflictWarning: "Cảnh báo: Trùng lịch với môn học khác trong cùng khung giờ!",
    createScheduleBtn: "Thêm vào Thời khóa biểu",
    saveScheduleBtn: "Lưu thay đổi",

    days: {
      mon: { short: "T2", full: "Thứ Hai", letter: "T2" },
      tue: { short: "T3", full: "Thứ Ba", letter: "T3" },
      wed: { short: "T4", full: "Thứ Tư", letter: "T4" },
      thu: { short: "T5", full: "Thứ Năm", letter: "T5" },
      fri: { short: "T6", full: "Thứ Sáu", letter: "T6" },
      sat: { short: "T7", full: "Thứ Bảy", letter: "T7" },
      sun: { short: "CN", full: "Chủ Nhật", letter: "CN" },
    },

    footerDesc: "Ứng dụng quản lý lịch học và thời khóa biểu học kỳ tinh gọn.",
    product: "Sản phẩm",
    createAccount: "Tạo tài khoản",
    security: "Bảo mật & Dữ liệu",
    httpOnly: "Cookie HTTPOnly",
    encrypted: "Phiên làm việc mã hóa",
    isolation: "Bảo mật dữ liệu cá nhân",
    rights: "Demuse Planner. Bản quyền đã được bảo lưu.",
  },

  en: {
    today: "Today",
    timetable: "Timetable",
    courses: "Courses",
    settings: "Settings",
    addClass: "Add Class",
    quickAdd: "Quick Add Class",
    signOut: "Sign Out",
    signIn: "Sign In",
    getStarted: "Get Started",
    currentTerm: "Current Term",

    heroTitle: "Simple, calm timetable and schedule planner.",
    heroSubtitle: "Manage class schedules, track room locations, view live lecture countdowns, and prevent timing conflicts.",
    startFree: "Get Started Free",
    demoNote: "Clean, personal timetable manager for students and educators.",
    whatDemuseDoes: "Core Features",
    whatDemuseDoesSub: "A practical tool designed to keep your weekly schedule clear and organized.",
    feature1Title: "Live Class Countdown",
    feature1Desc: "View your current and upcoming classes with remaining time and room information.",
    feature2Title: "Conflict Detection",
    feature2Desc: "Automatic detection and alerts when class time slots overlap.",
    feature3Title: "Phone Notifications",
    feature3Desc: "Receive reminders before class starts on mobile devices and desktop browsers.",
    feature4Title: "Schedule Sharing",
    feature4Desc: "Generate read-only share links for study partners or advisors.",
    ctaTitle: "Organize your semester schedule",
    ctaSub: "Create an account to start managing your courses and weekly timetable.",
    ctaButton: "Create Free Account",

    goodDay: "Good day",
    classInSession: "Class in session",
    upNext: "Up next",
    allClassesFinished: "All classes finished today",
    noClassesToday: "No classes today",
    welcomeToDemuse: "Welcome to Demuse",
    noClassesScheduledYet: "No classes scheduled yet",
    addSubjectsPrompt: "Add your subjects to see your daily timetable countdown.",
    viewFullWeek: "View Full Week",
    addFirstClass: "Add First Class",
    room: "Room",

    todaysSchedule: "Today's Schedule",
    sessionCount: "sessions lined up today",
    noClassesScheduledToday: "No classes scheduled for today",
    enjoyFreeTime: "Enjoy your free time or review upcoming coursework.",
    addClassForToday: "Add class for today",

    weeklyWorkload: "Weekly Workload",
    workloadSub: "Overview of commitments across the week",
    openPlanner: "Open Planner",
    activeTimetable: "Active Timetable",
    coursesEnrolled: "courses enrolled",
    weeklySessions: "weekly sessions",
    publicBadge: "Public",
    privateBadge: "Private",
    offDay: "Off",

    filterPlaceholder: "Filter by subject, teacher, or room...",
    fullWeek7Days: "7 Days (Full Week)",
    workDays5Days: "5 Days (Mon–Fri)",
    share: "Share",
    addCourse: "Add Course",
    noClassesOnDay: "No classes",
    freeDayMessage: "Your schedule is free for this day. Tap below to add a class or study block.",
    clickToAdd: "Click to add",
    confirmDeleteClass: "Are you sure you want to remove this class from your timetable?",

    courseCatalog: "Course Catalog",
    courseCatalogSub: "Manage your courses, instructors, venues, and color associations",
    noCoursesYet: "No courses added yet",
    noCoursesSub: "Create your first subject or course to start building your weekly timetable.",
    addNewCourse: "Add New Course",
    courseName: "Course Name",
    courseCode: "Course Code",
    instructor: "Instructor / Teacher",
    defaultRoom: "Default Room",
    colorTheme: "Visual Color Theme",
    notesSyllabus: "Notes / Syllabus / Textbook",
    editCourse: "Edit Course",
    editDetails: "Edit details →",
    saveChanges: "Save Changes",
    createCourse: "Create Course",
    cancel: "Cancel",
    confirmDeleteCourse: "Are you sure you want to delete this course? All scheduled class slots for this subject will also be deleted.",

    preferencesSettings: "Preferences & Settings",
    settingsSub: "Manage your account profile, timetable metadata, and notification alerts",
    studentProfile: "Student Profile",
    fullName: "Full Name",
    emailAddress: "Email Address",
    emailHelper: "Email is bound to your account login.",
    saveProfile: "Save Profile",
    profileSaved: "Profile updated successfully",
    securityPassword: "Security & Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    updatePassword: "Update Password",
    passwordSaved: "Password updated successfully",
    classNotificationAlerts: "Class Notification Alerts",
    upcomingClassReminders: "Upcoming Class Reminders",
    upcomingRemindersSub: "Receive notifications before each scheduled class begins",
    leadTimeLabel: "Default Notification Lead Time",
    soundAlert: "Notification Chime Sound",
    soundAlertSub: "Play a gentle sound when alerts trigger",
    testPhonePopup: "Test Phone Popup",
    savePreferences: "Save Preferences",
    preferencesSaved: "Notification preferences saved",
    iphoneTipTitle: "📱 Tip for iPhone / iOS Users:",
    iphoneTipBody: "On iPhone (iOS 16.4+), tap Safari's Share button (square with arrow) → tap \"Add to Home Screen\". Open Demuse from your Home Screen to enable native push notification popups.",
    timetableDetails: "Timetable Details",
    timetableTitle: "Timetable Title",
    academicTerm: "Academic Term / Semester",
    departmentDesc: "Description / Department",
    saveTimetable: "Save Details",

    shareTimetable: "Share Timetable",
    shareTimetableDesc: "Create a secure public link for classmates, advisors, or study groups.",
    publicLinkActive: "Public link active",
    privateTimetable: "Private timetable",
    publicLinkHelp: "Anyone with the unique link can view this timetable in read-only mode.",
    privateLinkHelp: "Only you can see this timetable.",
    shareableLink: "Shareable Link",
    copyLink: "Copy Link",
    copied: "Copied",
    resetLink: "Reset link token",
    turnOnPublic: "Turn on public link to generate a shareable URL.",
    done: "Done",

    addNewClass: "Add New Class",
    configureClassTiming: "Configure subject details, timing, and room for this class slot.",
    selectExistingCourse: "Select Existing Course",
    orAddNewCourse: "Or Create New Course",
    daysOfWeekLabel: "Days of Week",
    startTime: "Start Time",
    endTime: "End Time",
    classType: "Class Type",
    roomVenue: "Room / Venue",
    timeConflictWarning: "Warning: This schedule slot clashes with another class!",
    createScheduleBtn: "Add to Timetable",
    saveScheduleBtn: "Save Changes",

    days: {
      mon: { short: "Mon", full: "Monday", letter: "M" },
      tue: { short: "Tue", full: "Tuesday", letter: "T" },
      wed: { short: "Wed", full: "Wednesday", letter: "W" },
      thu: { short: "Thu", full: "Thursday", letter: "T" },
      fri: { short: "Fri", full: "Friday", letter: "F" },
      sat: { short: "Sat", full: "Saturday", letter: "S" },
      sun: { short: "Sun", full: "Sunday", letter: "S" },
    },

    footerDesc: "A focused schedule management tool for academic and personal planning.",
    product: "Product",
    createAccount: "Create Account",
    security: "Security & Privacy",
    httpOnly: "Strict HTTPOnly Cookies",
    encrypted: "Encrypted Sessions",
    isolation: "Tenant Data Isolation",
    rights: "Demuse Planner. All rights reserved.",
  },

  fr: {
    today: "Aujourd'hui",
    timetable: "Emploi du temps",
    courses: "Cours",
    settings: "Paramètres",
    addClass: "Ajouter un cours",
    quickAdd: "Ajout rapide",
    signOut: "Déconnexion",
    signIn: "Connexion",
    getStarted: "Commencer",
    currentTerm: "Semestre en cours",

    heroTitle: "Planificateur d'emploi du temps simple et serein.",
    heroSubtitle: "Gérez vos cours, salles, compte à rebours en direct et évitez les conflits d'horaires.",
    startFree: "Commencer gratuitement",
    demoNote: "Gestionnaire d'emploi du temps clair pour étudiants et enseignants.",
    whatDemuseDoes: "Fonctionnalités clés",
    whatDemuseDoesSub: "Des outils essentiels pour organiser sereinement votre semaine de cours.",
    feature1Title: "Compte à rebours du cours",
    feature1Desc: "Consultez la salle, le professeur et les minutes restantes avant le prochain cours.",
    feature2Title: "Détection des conflits",
    feature2Desc: "Alerte automatique en cas de chevauchement de deux créneaux de cours.",
    feature3Title: "Notifications mobiles",
    feature3Desc: "Rappels avant le début des cours sur iPhone, Android et navigateurs.",
    feature4Title: "Partage de planning",
    feature4Desc: "Créez un lien en lecture seule pour vos camarades ou tuteurs.",
    ctaTitle: "Organisez votre planning de cours",
    ctaSub: "Créez votre compte pour gérer vos cours et votre emploi du temps.",
    ctaButton: "Créer un compte gratuit",

    goodDay: "Bonjour",
    classInSession: "Cours en cours",
    upNext: "Prochain cours",
    allClassesFinished: "Tous les cours sont terminés aujourd'hui",
    noClassesToday: "Aucun cours aujourd'hui",
    welcomeToDemuse: "Bienvenue sur Demuse",
    noClassesScheduledYet: "Aucun cours programmé",
    addSubjectsPrompt: "Ajoutez vos matières pour suivre votre emploi du temps.",
    viewFullWeek: "Voir toute la semaine",
    addFirstClass: "Ajouter un premier cours",
    room: "Salle",

    todaysSchedule: "Programme du jour",
    sessionCount: "séances programmées aujourd'hui",
    noClassesScheduledToday: "Aucun cours prévu aujourd'hui",
    enjoyFreeTime: "Profitez de votre temps libre ou révisez vos prochains cours.",
    addClassForToday: "Ajouter un cours aujourd'hui",

    weeklyWorkload: "Charge hebdomadaire",
    workloadSub: "Aperçu de vos cours de la semaine",
    openPlanner: "Ouvrir l'agenda",
    activeTimetable: "Emploi du temps actif",
    coursesEnrolled: "cours enregistrés",
    weeklySessions: "séances / semaine",
    publicBadge: "Public",
    privateBadge: "Privé",
    offDay: "Libre",

    filterPlaceholder: "Filtrer par matière, enseignant ou salle...",
    fullWeek7Days: "7 Jours (Semaine complète)",
    workDays5Days: "5 Jours (Lun–Ven)",
    share: "Partager",
    addCourse: "Ajouter un cours",
    noClassesOnDay: "Pas de cours",
    freeDayMessage: "Votre journée est libre. Cliquez ci-dessous pour ajouter un cours.",
    clickToAdd: "Cliquer pour ajouter",
    confirmDeleteClass: "Voulez-vous vraiment supprimer ce cours de votre emploi du temps ?",

    courseCatalog: "Catalogue des Cours",
    courseCatalogSub: "Gérez vos matières, professeurs, salles et codes couleurs",
    noCoursesYet: "Aucun cours ajouté",
    noCoursesSub: "Ajoutez votre premier cours pour construire votre emploi du temps.",
    addNewCourse: "Nouveau cours",
    courseName: "Nom du cours",
    courseCode: "Code du cours",
    instructor: "Enseignant",
    defaultRoom: "Salle par défaut",
    colorTheme: "Thème de couleur",
    notesSyllabus: "Notes / Syllabus",
    editCourse: "Modifier le cours",
    editDetails: "Modifier les détails →",
    saveChanges: "Enregistrer",
    createCourse: "Créer le cours",
    cancel: "Annuler",
    confirmDeleteCourse: "Voulez-vous supprimer ce cours ? Toutes les séances associées seront également supprimées.",

    preferencesSettings: "Paramètres & Préférences",
    settingsSub: "Gérez votre profil, vos emplois du temps et vos alertes",
    studentProfile: "Profil Utilisateur",
    fullName: "Nom complet",
    emailAddress: "Adresse e-mail",
    emailHelper: "L'e-mail est associé à votre compte de connexion.",
    saveProfile: "Enregistrer le profil",
    profileSaved: "Profil mis à jour avec succès",
    securityPassword: "Sécurité & Mot de passe",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    updatePassword: "Mettre à jour le mot de passe",
    passwordSaved: "Mot de passe mis à jour",
    classNotificationAlerts: "Alertes de Cours",
    upcomingClassReminders: "Rappels de cours à venir",
    upcomingRemindersSub: "Recevez une notification avant chaque cours",
    leadTimeLabel: "Délai de notification par défaut",
    soundAlert: "Sonnerie de notification",
    soundAlertSub: "Émettre un son lors des rappels",
    testPhonePopup: "Tester la notification",
    savePreferences: "Enregistrer les préférences",
    preferencesSaved: "Préférences de notification enregistrées",
    iphoneTipTitle: "📱 Astuce pour iPhone / iOS :",
    iphoneTipBody: "Sur iPhone (iOS 16.4+), appuyez sur le bouton Partager de Safari → \"Sur l'écran d'accueil\". Ouvrez Demuse depuis l'écran d'accueil pour activer les notifications push.",
    timetableDetails: "Détails de l'emploi du temps",
    timetableTitle: "Titre de l'emploi du temps",
    academicTerm: "Semestre / Année",
    departmentDesc: "Description / Filière",
    saveTimetable: "Enregistrer les détails",

    shareTimetable: "Partager l'emploi du temps",
    shareTimetableDesc: "Créez un lien public sécurisé pour vos camarades ou professeurs.",
    publicLinkActive: "Lien public activé",
    privateTimetable: "Emploi du temps privé",
    publicLinkHelp: "Toute personne disposant du lien peut consulter l'agenda en lecture seule.",
    privateLinkHelp: "Vous seul pouvez voir cet emploi du temps.",
    shareableLink: "Lien de partage",
    copyLink: "Copier le lien",
    copied: "Copié",
    resetLink: "Régénérer le lien",
    turnOnPublic: "Activez le lien public pour générer une URL de partage.",
    done: "Terminé",

    addNewClass: "Ajouter un créneau",
    configureClassTiming: "Configurez la matière, l'horaire et la salle pour ce créneau.",
    selectExistingCourse: "Sélectionner un cours existant",
    orAddNewCourse: "Ou créer un nouveau cours",
    daysOfWeekLabel: "Jours de la semaine",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    classType: "Type de cours",
    roomVenue: "Salle / Lieu",
    timeConflictWarning: "Attention : Ce créneau chevauche un autre cours !",
    createScheduleBtn: "Ajouter à l'agenda",
    saveScheduleBtn: "Enregistrer les modifications",

    days: {
      mon: { short: "Lun", full: "Lundi", letter: "L" },
      tue: { short: "Mar", full: "Mardi", letter: "M" },
      wed: { short: "Mer", full: "Mercredi", letter: "M" },
      thu: { short: "Jeu", full: "Jeudi", letter: "J" },
      fri: { short: "Ven", full: "Vendredi", letter: "V" },
      sat: { short: "Sam", full: "Samedi", letter: "S" },
      sun: { short: "Dim", full: "Dimanche", letter: "D" },
    },

    footerDesc: "Outil de gestion d'emploi du temps clair et efficace.",
    product: "Produit",
    createAccount: "Créer un compte",
    security: "Sécurité & Données",
    httpOnly: "Cookies HTTPOnly",
    encrypted: "Sessions chiffrées",
    isolation: "Isolation des données",
    rights: "Demuse Planner. Tous droits réservés.",
  },

  de: {
    today: "Heute",
    timetable: "Stundenplan",
    courses: "Kurse",
    settings: "Einstellungen",
    addClass: "Kurs hinzufügen",
    quickAdd: "Schnell hinzufügen",
    signOut: "Abmelden",
    signIn: "Anmelden",
    getStarted: "Starten",
    currentTerm: "Aktuelles Semester",

    heroTitle: "Einfacher und übersichtlicher Stundenplaner.",
    heroSubtitle: "Verwalten Sie Vorlesungen, Räume, Live-Countdowns und vermeiden Sie Terminüberschneidungen.",
    startFree: "Kostenlos starten",
    demoNote: "Klarer Stundenplaner für Studierende und Lehrkräfte.",
    whatDemuseDoes: "Kernfunktionen",
    whatDemuseDoesSub: "Wesentliche Werkzeuge zur mühelosen Organisation Ihrer Studienwoche.",
    feature1Title: "Live-Kurs-Countdown",
    feature1Desc: "Sehen Sie Raum, Dozent und die verbleibende Zeit bis zur nächsten Vorlesung.",
    feature2Title: "Konflikterkennung",
    feature2Desc: "Automatische Warnung bei sich überschneidenden Kurszeiten.",
    feature3Title: "Smartphone-Benachrichtigungen",
    feature3Desc: "Erinnerungen vor Kursbeginn auf iPhone, Android und Desktop.",
    feature4Title: "Stundenplan teilen",
    feature4Desc: "Schreibgeschützten Link für Kommilitonen oder Betreuer erstellen.",
    ctaTitle: "Planen Sie Ihr Semester",
    ctaSub: "Erstellen Sie ein Konto, um Ihre Kurse und Ihren Wochenplan zu verwalten.",
    ctaButton: "Kostenloses Konto erstellen",

    goodDay: "Guten Tag",
    classInSession: "Kurs läuft gerade",
    upNext: "Als Nächstes",
    allClassesFinished: "Alle Kurse für heute beendet",
    noClassesToday: "Heute keine Kurse",
    welcomeToDemuse: "Willkommen bei Demuse",
    noClassesScheduledYet: "Noch keine Kurse eingetragen",
    addSubjectsPrompt: "Fügen Sie Fächer hinzu, um Ihren Tagesplan zu aktivieren.",
    viewFullWeek: "Ganze Woche anzeigen",
    addFirstClass: "Ersten Kurs hinzufügen",
    room: "Raum",

    todaysSchedule: "Heutiger Ablauf",
    sessionCount: "Einheiten heute geplant",
    noClassesScheduledToday: "Heute stehen keine Kurse an",
    enjoyFreeTime: "Genießen Sie Ihre freie Zeit oder bereiten Sie kommende Kurse vor.",
    addClassForToday: "Kurs für heute hinzufügen",

    weeklyWorkload: "Wöchentliche Auslastung",
    workloadSub: "Übersicht über Ihre Termine in dieser Woche",
    openPlanner: "Planer öffnen",
    activeTimetable: "Aktiver Stundenplan",
    coursesEnrolled: "eingetragene Kurse",
    weeklySessions: "Einheiten / Woche",
    publicBadge: "Öffentlich",
    privateBadge: "Privat",
    offDay: "Frei",

    filterPlaceholder: "Nach Fach, Dozent oder Raum filtern...",
    fullWeek7Days: "7 Tage (Ganze Woche)",
    workDays5Days: "5 Tage (Mo–Fr)",
    share: "Teilen",
    addCourse: "Fach hinzufügen",
    noClassesOnDay: "Keine Kurse",
    freeDayMessage: "An diesem Tag haben Sie frei. Tippen Sie unten, um einen Kurs hinzuzufügen.",
    clickToAdd: "Klicken zum Hinzufügen",
    confirmDeleteClass: "Möchten Sie diesen Kurs wirklich aus dem Stundenplan entfernen?",

    courseCatalog: "Kurskatalog",
    courseCatalogSub: "Verwalten Sie Fächer, Dozenten, Räume und Farbmarkierungen",
    noCoursesYet: "Noch keine Kurse vorhanden",
    noCoursesSub: "Erstellen Sie Ihr erstes Fach, um Ihren Stundenplan aufzubauen.",
    addNewCourse: "Neues Fach hinzufügen",
    courseName: "Kursname",
    courseCode: "Kurskürzel",
    instructor: "Dozent / Lehrkraft",
    defaultRoom: "Standardraum",
    colorTheme: "Farbthema",
    notesSyllabus: "Notizen / Lehrplan",
    editCourse: "Kurs bearbeiten",
    editDetails: "Details bearbeiten →",
    saveChanges: "Änderungen speichern",
    createCourse: "Kurs erstellen",
    cancel: "Abbrechen",
    confirmDeleteCourse: "Möchten Sie dieses Fach wirklich löschen? Alle zugehörigen Stundenplaneinträge werden ebenfalls gelöscht.",

    preferencesSettings: "Einstellungen & Optionen",
    settingsSub: "Verwalten Sie Profil, Stundenpläne und Benachrichtigungen",
    studentProfile: "Benutzerprofil",
    fullName: "Vollständiger Name",
    emailAddress: "E-Mail-Adresse",
    emailHelper: "Die E-Mail ist fest mit Ihrem Konto verknüpft.",
    saveProfile: "Profil speichern",
    profileSaved: "Profil erfolgreich aktualisiert",
    securityPassword: "Sicherheit & Passwort",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    updatePassword: "Passwort ändern",
    passwordSaved: "Passwort erfolgreich geändert",
    classNotificationAlerts: "Kurs-Benachrichtigungen",
    upcomingClassReminders: "Erinnerung an anstehende Kurse",
    upcomingRemindersSub: "Erhalten Sie vor jedem Kursbeginn eine Benachrichtigung",
    leadTimeLabel: "Standard-Vorlaufzeit für Erinnerungen",
    soundAlert: "Benachrichtigungston",
    soundAlertSub: "Sanften Hinweiston bei Alarmen abspielen",
    testPhonePopup: "Benachrichtigung testen",
    savePreferences: "Einstellungen speichern",
    preferencesSaved: "Benachrichtigungseinstellungen gespeichert",
    iphoneTipTitle: "📱 Tipp für iPhone / iOS-Nutzer:",
    iphoneTipBody: "Auf dem iPhone (iOS 16.4+) in Safari auf Teilen tippen → \"Zum Home-Bildschirm\". Öffnen Sie Demuse vom Home-Bildschirm, um Push-Benachrichtigungen zu aktivieren.",
    timetableDetails: "Stundenplan-Details",
    timetableTitle: "Name des Stundenplans",
    academicTerm: "Semester / Studienjahr",
    departmentDesc: "Beschreibung / Studiengang",
    saveTimetable: "Details speichern",

    shareTimetable: "Stundenplan teilen",
    shareTimetableDesc: "Erstellen Sie einen sicheren öffentlichen Link für Kommilitonen oder Betreuer.",
    publicLinkActive: "Öffentlicher Link aktiv",
    privateTimetable: "Privater Stundenplan",
    publicLinkHelp: "Jeder mit dem Link kann den Stundenplan im Lesemodus einsehen.",
    privateLinkHelp: "Nur Sie können diesen Stundenplan sehen.",
    shareableLink: "Teilbarer Link",
    copyLink: "Link kopieren",
    copied: "Kopiert",
    resetLink: "Link-Token erneuern",
    turnOnPublic: "Aktivieren Sie den öffentlichen Link, um eine URL zu erzeugen.",
    done: "Fertig",

    addNewClass: "Kurseinheit hinzufügen",
    configureClassTiming: "Legen Sie Fach, Uhrzeit und Raum für diese Einheit fest.",
    selectExistingCourse: "Bestehendes Fach wählen",
    orAddNewCourse: "Oder neues Fach anlegen",
    daysOfWeekLabel: "Wochentage",
    startTime: "Startzeit",
    endTime: "Endzeit",
    classType: "Veranstaltungsart",
    roomVenue: "Raum / Ort",
    timeConflictWarning: "Achtung: Dieser Termin überschneidet sich mit einem anderen Kurs!",
    createScheduleBtn: "Zum Plan hinzufügen",
    saveScheduleBtn: "Änderungen speichern",

    days: {
      mon: { short: "Mo", full: "Montag", letter: "M" },
      tue: { short: "Di", full: "Dienstag", letter: "D" },
      wed: { short: "Mi", full: "Mittwoch", letter: "M" },
      thu: { short: "Do", full: "Donnerstag", letter: "D" },
      fri: { short: "Fr", full: "Freitag", letter: "F" },
      sat: { short: "Sa", full: "Samstag", letter: "S" },
      sun: { short: "So", full: "Sonntag", letter: "S" },
    },

    footerDesc: "Kompakter und fokussierter Stundenplaner für das Studium.",
    product: "Produkt",
    createAccount: "Konto erstellen",
    security: "Sicherheit & Datenschutz",
    httpOnly: "HTTPOnly-Cookies",
    encrypted: "Verschlüsselte Sitzungen",
    isolation: "Mandantentrennung",
    rights: "Demuse Planner. Alle Rechte vorbehalten.",
  },
};

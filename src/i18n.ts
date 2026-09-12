import { Language } from './types';

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  offlineNotice: string;
  newGame: string;
  howToPlay: string;
  settings: string;
  credits: string;
  creditsAuthors: string;
  playerSetup: string;
  addPlayer: string;
  playerNamePlaceholder: string;
  editPlayer: string;
  removePlayer: string;
  playersCount: string;
  minPlayersNotice: string;
  maxPlayersNotice: string;
  duplicateNameError: string;
  emptyNameError: string;
  startGame: string;
  gameReady: string;
  physicalCardReminderTitle: string;
  physicalCardReminderBody: string;
  physicalCardWarning: string;
  startNight: string;
  nightTitle: string;
  closeEyesPrompt: string;
  beginNightPhase: string;
  mafiaWakeTitle: string;
  whoAreYou: string;
  selectYourName: string;
  confirmIdentity: string;
  mafiaEliminatePrompt: string;
  confirmTarget: string;
  confirmAndSleep: string;
  privacyTransitionTitle: string;
  passingModeratorNotice: string;
  secondsRemaining: string;
  detectiveWakeTitle: string;
  detectiveInvestigatePrompt: string;
  inspectTarget: string;
  investigationResult: string;
  targetIsMafia: string;
  targetIsInnocent: string;
  secretResultNotice: string;
  nextSleep: string;
  doctorWakeTitle: string;
  doctorProtectPrompt: string;
  morningTransitionTitle: string;
  dawnApproaching: string;
  morningResultTitle: string;
  noOneEliminated: string;
  playerEliminated: string;
  revealPhysicalCardNotice: string;
  proceedToDiscussion: string;
  dayDiscussionTitle: string;
  startTimer: string;
  pauseTimer: string;
  add30s: string;
  skipTimer: string;
  timeRemaining: string;
  livingCitizensCount: string;
  proceedToVoting: string;
  dayVotingTitle: string;
  passPhoneTo: string;
  iAmReady: string;
  votePrompt: string;
  selectVoteTarget: string;
  confirmVote: string;
  voteRecorded: string;
  passToNextPlayer: string;
  voteResultTitle: string;
  voteSummary: string;
  votesCount: string;
  highestVoted: string;
  tieDetected: string;
  tieResolvedNoElimination: string;
  tieResolvedRevote: string;
  tieResolvedBoth: string;
  eliminationNotice: string;
  proceedToNight: string;
  victoryTitle: string;
  citizensWinTitle: string;
  citizensWinDesc: string;
  mafiaWinTitle: string;
  mafiaWinDesc: string;
  playAgain: string;
  returnHome: string;
  settingsTitle: string;
  languageLabel: string;
  appLogoTitle: string;
  uploadLogo: string;
  resetDefaultLogo: string;
  confirmLogoSave: string;
  logoPreview: string;
  nightSettingsTitle: string;
  transitionDelayLabel: string;
  soundEffectsLabel: string;
  ambientAudioLabel: string;
  masterVolumeLabel: string;
  daySettingsTitle: string;
  discussionDurationLabel: string;
  tieBehaviorLabel: string;
  tieNoElimination: string;
  tieRevote: string;
  tieBoth: string;
  saveSettings: string;
  close: string;
  confirmDialogTitle: string;
  confirm: string;
  cancel: string;
  rulesTitle: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  rule4Title: string;
  rule4Desc: string;
  cannotSelectSelf: string;
  androidCodeExport: string;
  androidCodeTitle: string;
  androidCodeSubtitle: string;
  copyCode: string;
  copied: string;
  downloadKt: string;
  moderatorMenu: string;
  chronicleTitle: string;
  chronicleEmpty: string;
  soundboardTitle: string;
  soundboardDesc: string;
  soundGong: string;
  soundGavel: string;
  soundHeartbeat: string;
  soundDawn: string;
  soundInspect: string;
  soundHeal: string;
  soundWind: string;
  councilRosterTitle: string;
  aliveCitizens: string;
  fallenCitizens: string;
  abandonGameTitle: string;
  abandonGamePrompt: string;
  abandonConfirm: string;
  roleSettings: string;
  enableDetectiveLabel: string;
  enableDoctorLabel: string;
  hapticFeedbackLabel: string;
  reorderSeats: string;
  moveUp: string;
  moveDown: string;
  saveRoster: string;
  loadRoster: string;
  savedRosters: string;
  rosterSavedSuccess: string;
  enterRosterName: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "Mafia — Offline Moderator",
    appSubtitle: "مافيا • Egyptian Physical Card Companion",
    offlineNotice: "100% Offline • No accounts • Physical card companion",
    newGame: "New Game",
    howToPlay: "How to Play & Rules",
    settings: "Settings",
    credits: "Credits",
    creditsAuthors: "Created by Ahmed Amr & Almuddaththir",
    playerSetup: "Gather the Council",
    addPlayer: "Add Player",
    playerNamePlaceholder: "Enter player name...",
    editPlayer: "Edit Name",
    removePlayer: "Remove",
    playersCount: "Players",
    minPlayersNotice: "Minimum 4 players required",
    maxPlayersNotice: "Maximum 10 players reached",
    duplicateNameError: "A player with this name already exists",
    emptyNameError: "Please enter a valid player name",
    startGame: "Confirm Cards & Assemble",
    gameReady: "Physical Deck Distribution",
    physicalCardReminderTitle: "Distribute Your Physical Cards",
    physicalCardReminderBody: "Hand out the real Mafia card deck face-down. The app will NOT reveal or assign roles automatically. Players will discreetly identify themselves to the moderator during the upcoming night phase.",
    physicalCardWarning: "Keep your physical cards face down at all times!",
    startNight: "Initiate Nightfall",
    nightTitle: "Nightfall in the Citadel",
    closeEyesPrompt: "Everyone, close your eyes! Silence descends upon the realm.",
    beginNightPhase: "Summon the Night",
    mafiaWakeTitle: "Mafia Awakening",
    whoAreYou: "Identify Yourself",
    selectYourName: "Select your own name from the living council:",
    confirmIdentity: "Confirm Identity",
    mafiaEliminatePrompt: "Choose a target to eliminate tonight:",
    confirmTarget: "Confirm Assassination Target",
    confirmAndSleep: "Confirm & Close Eyes",
    privacyTransitionTitle: "Concealment in Progress",
    passingModeratorNotice: "Pass the device face-down or place it safely on the table. Do not peek.",
    secondsRemaining: "Seconds remaining until next phase",
    detectiveWakeTitle: "Detective Awakening",
    detectiveInvestigatePrompt: "Choose a player to inspect under the lantern:",
    inspectTarget: "Inspect Player",
    investigationResult: "Private Lantern Inspection",
    targetIsMafia: "AFFILIATION: MAFIA ☠️",
    targetIsInnocent: "AFFILIATION: INNOCENT ⚖️",
    secretResultNotice: "Strict Secrecy: Do not show this screen or react. Tap Next to conceal immediately.",
    nextSleep: "Conceal & Close Eyes",
    doctorWakeTitle: "Doctor Awakening",
    doctorProtectPrompt: "Select a player to protect with the sacred balm tonight:",
    morningTransitionTitle: "Dawn Approaches",
    dawnApproaching: "The night whispers fade away... Dawn breaks over the sands.",
    morningResultTitle: "Morning Proclamation",
    noOneEliminated: "By divine fortune or skilled medicine, no blood was shed last night! All survive.",
    playerEliminated: "fell victim to the shadows last night and has perished.",
    revealPhysicalCardNotice: "Instruct the fallen player to reveal their physical card according to your house rules.",
    proceedToDiscussion: "Convene Council Discussion",
    dayDiscussionTitle: "Council Gathering & Debate",
    startTimer: "Start Debate",
    pauseTimer: "Pause",
    add30s: "+30s",
    skipTimer: "Conclude Debate",
    timeRemaining: "Debate Time Remaining",
    livingCitizensCount: "Living Council Members",
    proceedToVoting: "Proceed to Secret Voting",
    dayVotingTitle: "Secret Council Balloting",
    passPhoneTo: "Hand the device privately to",
    iAmReady: "I am ready — Open Ballot",
    votePrompt: "Cast your secret vote against a suspect:",
    selectVoteTarget: "Select suspect",
    confirmVote: "Cast Ballot",
    voteRecorded: "Vote cast in absolute secrecy.",
    passToNextPlayer: "Pass device safely to the next council member.",
    voteResultTitle: "The Council's Judgment",
    voteSummary: "Ballot Tally",
    votesCount: "votes",
    highestVoted: "Highest Accusations",
    tieDetected: "Tied Accusations Detected!",
    tieResolvedNoElimination: "The council could not reach consensus. No one is banished today.",
    tieResolvedRevote: "A runoff debate will commence among the accused.",
    tieResolvedBoth: "The verdict condemns both suspects to exile.",
    eliminationNotice: "was condemned by council vote and banished.",
    proceedToNight: "Nightfall Descends Again",
    victoryTitle: "Destiny Fulfilled",
    citizensWinTitle: "Victory for the Citizens! ⚖️",
    citizensWinDesc: "The Mafia syndicate has been eradicated from the realm. Peace is restored to the sands!",
    mafiaWinTitle: "The Mafia Reigns Supreme! 👑",
    mafiaWinDesc: "The underworld forces now equal or outnumber the innocent citizens. The council has fallen.",
    playAgain: "Play Again (Keep Players)",
    returnHome: "Return to Home",
    settingsTitle: "Moderator Settings",
    languageLabel: "Language / اللغة",
    appLogoTitle: "Custom App Emblem / Logo",
    uploadLogo: "Upload Custom Emblem",
    resetDefaultLogo: "Restore Default Emblem",
    confirmLogoSave: "Save Selected Emblem",
    logoPreview: "Emblem Preview",
    nightSettingsTitle: "Night Phase Configuration",
    transitionDelayLabel: "Privacy Transition Delay",
    soundEffectsLabel: "Procedural Sound FX",
    ambientAudioLabel: "Night Ambient Drone",
    masterVolumeLabel: "Master Volume",
    daySettingsTitle: "Day Phase Configuration",
    discussionDurationLabel: "Discussion Duration",
    tieBehaviorLabel: "Tie Vote Resolution",
    tieNoElimination: "No Elimination (Peaceful Day)",
    tieRevote: "Runoff Revote",
    tieBoth: "Eliminate Both Tied",
    saveSettings: "Apply Settings",
    close: "Close",
    confirmDialogTitle: "Confirm Action",
    confirm: "Confirm",
    cancel: "Cancel",
    rulesTitle: "Game Rules & Moderator Protocol",
    rule1Title: "1. Real Physical Cards",
    rule1Desc: "Distribute your physical Mafia card deck. Each player knows their role from their card. The moderator never assigns roles.",
    rule2Title: "2. Night Phase Identification",
    rule2Desc: "On Night 1, the app asks each special role (Mafia, Detective, Doctor) 'Who are you?' so it learns their identity privately without anyone else knowing.",
    rule3Title: "3. Absolute Secrecy & Sound Cues",
    rule3Desc: "The device plays atmospheric procedural sounds to alert the next role to open their eyes. Pass transitions give 6 seconds of pitch-black screen to prevent peeking.",
    rule4Title: "4. Physical Card Revealing",
    rule4Desc: "When a player is eliminated (by night strike or day vote), the moderator reminds the group to reveal their physical card per your preferred card rules.",
    cannotSelectSelf: "You cannot select yourself as a target.",
    androidCodeExport: "Jetpack Compose Kotlin Code",
    androidCodeTitle: "Native Android (Kotlin + Compose) Source",
    androidCodeSubtitle: "Production-ready offline Kotlin Jetpack Compose code matching this game engine.",
    copyCode: "Copy Code",
    copied: "Copied!",
    downloadKt: "Download Source (.kt)",
    moderatorMenu: "Moderator Chamber",
    chronicleTitle: "Match Chronicle",
    chronicleEmpty: "No recorded events yet. The chronicle unfolds as night and day pass.",
    soundboardTitle: "Soundboard & Atmosphere",
    soundboardDesc: "Trigger authentic offline procedural sound cues for your game table.",
    soundGong: "Night Gong",
    soundGavel: "Moderator Gavel",
    soundHeartbeat: "Heartbeat Pulse",
    soundDawn: "Dawn Chimes",
    soundInspect: "Inspect Ping",
    soundHeal: "Healing Antidote",
    soundWind: "Eerie Wind",
    councilRosterTitle: "Council Roster Status",
    aliveCitizens: "Living Council",
    fallenCitizens: "Fallen Spirits",
    abandonGameTitle: "Conclude Match?",
    abandonGamePrompt: "Are you sure you wish to abandon this ongoing match and return to the main hall?",
    abandonConfirm: "Yes, End Match",
    roleSettings: "Special Roles Deck Configuration",
    enableDetectiveLabel: "Include Detective Role",
    enableDoctorLabel: "Include Doctor Role",
    hapticFeedbackLabel: "Tactile Haptic Vibration",
    reorderSeats: "Seat Arrangement",
    moveUp: "Move Up",
    moveDown: "Move Down",
    saveRoster: "Save Current Roster",
    loadRoster: "Load Saved Roster",
    savedRosters: "Saved Friend Groups",
    rosterSavedSuccess: "Roster saved successfully!",
    enterRosterName: "Roster Name (e.g. Friday Squad):"
  },
  ar: {
    appName: "مافيا — المنظم بدون إنترنت",
    appSubtitle: "مافيا • رفيق بطاقات المافيا المصرية الأصيلة",
    offlineNotice: "يعمل أوفلاين بالكامل • بدون حسابات • مساعد للبطاقات الحقيقية",
    newGame: "لعبة جديدة",
    howToPlay: "طريقة اللعب والقوانين",
    settings: "الإعدادات",
    credits: "فريق العمل",
    creditsAuthors: "صممه: أحمد عمرو & المدثر",
    playerSetup: "تجهيز مجلس اللاعبين",
    addPlayer: "إضافة لاعب",
    playerNamePlaceholder: "اكتب اسم اللاعب...",
    editPlayer: "تعديل الاسم",
    removePlayer: "حذف",
    playersCount: "اللاعبون",
    minPlayersNotice: "الحد الأدنى 4 لاعبين",
    maxPlayersNotice: "الحد الأقصى 10 لاعبين",
    duplicateNameError: "يوجد لاعب بنفس الاسم بالفعل",
    emptyNameError: "من فضلك اكتب اسم لاعب صالح",
    startGame: "تأكيد توزيع الكروت والبدء",
    gameReady: "توزيع كروت اللعب الورقية",
    physicalCardReminderTitle: "وزعوا الكروت الحقيقية أولاً",
    physicalCardReminderBody: "وزعوا كروت المافيا الورقية مقلوبة على اللاعبين. التطبيق لن يوزع أو يعلن الأدوار تلقائياً؛ بل سيتعرف على أصحاب الأدوار الخاصة أثناء الليل بسرية تامة.",
    physicalCardWarning: "احرصوا على بقاء كروتكم مقلوبة ومخفية طوال الوقت!",
    startNight: "بدء حلول الليل",
    nightTitle: "حلول الليل على المدينة",
    closeEyesPrompt: "الجميع يغمض عينيه! يسود الصمت أرجاء المكان.",
    beginNightPhase: "بدء طقس الليل",
    mafiaWakeTitle: "استيقاظ المافيا",
    whoAreYou: "من أنت؟",
    selectYourName: "اختر اسمك من بين الأحياء في المجلس:",
    confirmIdentity: "تأكيد هويتك",
    mafiaEliminatePrompt: "اختر من تريد تصفيته الليلة:",
    confirmTarget: "تأكيد هدف التصفية",
    confirmAndSleep: "تأكيد وإغلاق العينين",
    privacyTransitionTitle: "شاشة التعتيم والسرية",
    passingModeratorNotice: "مرر الهاتف مقلوباً أو ضعه بهدوء على الطاولة. لا تنظر للشاشة.",
    secondsRemaining: "ثوانٍ متبقية للمرحلة القادمة",
    detectiveWakeTitle: "استيقاظ المحقق",
    detectiveInvestigatePrompt: "اختر لاعباً لفحصه بالفانوس السري:",
    inspectTarget: "فحص اللاعب",
    investigationResult: "نتيجة فحص المحقق الخاصة",
    targetIsMafia: "الهوية: مافيا ☠️",
    targetIsInnocent: "الهوية: بريء ⚖️",
    secretResultNotice: "سرية تامة: لا تُظهر هذه الشاشة لأحد ولا تُصدر رد فعل. اضغط التالي فوراً لإخفائها.",
    nextSleep: "إخفاء وإغلاق العينين",
    doctorWakeTitle: "استيقاظ الطبيب",
    doctorProtectPrompt: "اختر لاعباً لحمايته وإنقاذه بالترياق الليلة:",
    morningTransitionTitle: "بزوغ الصباح",
    dawnApproaching: "تتلاشى أصوات الليل... وتشرق شمس الصباح على المدينة.",
    morningResultTitle: "بيان الصباح",
    noOneEliminated: "بفضل الله وتدخل الطبيب البارع، لم تسقط أي دماء الليلة! نجا الجميع.",
    playerEliminated: "سقط ضحية في ظلمات الليل وغادر عالم الأحياء.",
    revealPhysicalCardNotice: "اطلبوا من اللاعب المستبعد الكشف عن كرته الورقي وفقاً لقواعدكم.",
    proceedToDiscussion: "بدء نقاش المجلس",
    dayDiscussionTitle: "اجتماع المجلس والنقاش",
    startTimer: "بدء النقاش",
    pauseTimer: "إيقاف مؤقت",
    add30s: "+30 ثانية",
    skipTimer: "إنهاء النقاش",
    timeRemaining: "الوقت المتبقي للنقاش",
    livingCitizensCount: "الأعضاء الأحياء في المجلس",
    proceedToVoting: "الانتقال للتصويت السري",
    dayVotingTitle: "التصويت السري للمجلس",
    passPhoneTo: "مرر الهاتف بسرية إلى",
    iAmReady: "أنا جاهز — افتح ورقة التصويت",
    votePrompt: "صوت بسرية ضد من تشك به:",
    selectVoteTarget: "اختر المشتبه به",
    confirmVote: "تأكيد الصوت",
    voteRecorded: "تم تسجيل صوتك بسرية مطلقة.",
    passToNextPlayer: "مرر الهاتف بأمان للعضو التالي.",
    voteResultTitle: "حكم مجلس المدينة",
    voteSummary: "فرز الأصوات",
    votesCount: "أصوات",
    highestVoted: "أعلى أصوات اتهام",
    tieDetected: "تعادل في الأصوات!",
    tieResolvedNoElimination: "لم يتوصل المجلس لإجماع. لن يُطرد أحد اليوم.",
    tieResolvedRevote: "جولة نقاش وتصويت إعادة بين المتهمين.",
    tieResolvedBoth: "قرر المجلس إبعاد كلا المتهمين المتعادلين.",
    eliminationNotice: "حكم عليه المجلس بالطرد بعد فرز الأصوات.",
    proceedToNight: "حلول الليل مجدداً",
    victoryTitle: "حسم المصير",
    citizensWinTitle: "انتصار المواطنين الشرفاء! ⚖️",
    citizensWinDesc: "تم القضاء على عناصر المافيا بالكامل من المدينة. عاد الأمن والأمان!",
    mafiaWinTitle: "المافيا تسيطر على المدينة! 👑",
    mafiaWinDesc: "أصبح عدد المافيا مساوياً أو أكبر من المواطنين الأحياء. سقط المجلس.",
    playAgain: "لعبة جديدة (نفس اللاعبين)",
    returnHome: "العودة للرئيسية",
    settingsTitle: "إعدادات المنظم",
    languageLabel: "اللغة / Language",
    appLogoTitle: "شعار التطبيق المخصص",
    uploadLogo: "رفع شعار مخصص",
    resetDefaultLogo: "استعادة الشعار الافتراضي",
    confirmLogoSave: "حفظ الشعار المختار",
    logoPreview: "معاينة الشعار",
    nightSettingsTitle: "إعدادات مرحلة الليل",
    transitionDelayLabel: "مدة شاشة التعتيم والسرية",
    soundEffectsLabel: "المؤثرات الصوتية",
    ambientAudioLabel: "صوت الليل الغامض",
    masterVolumeLabel: "مستوى الصوت العام",
    daySettingsTitle: "إعدادات مرحلة النهار",
    discussionDurationLabel: "مدة نقاش المجلس",
    tieBehaviorLabel: "التعامل مع تعادل الأصوات",
    tieNoElimination: "بدون استبعاد (يوم آمن)",
    tieRevote: "إعادة تصويت",
    tieBoth: "استبعاد كلا المتعادلين",
    saveSettings: "تطبيق الإعدادات",
    close: "إغلاق",
    confirmDialogTitle: "تأكيد الإجراء",
    confirm: "تأكيد",
    cancel: "إلغاء",
    rulesTitle: "قواعد اللعبة ودور المنظم",
    rule1Title: "1. الكروت الورقية الحقيقية هي الأساس",
    rule1Desc: "وزعوا كروت المافيا الحقيقية مقلوبة. كل لاعب يعرف دوره من كرته الشخصي. التطبيق ينظم اللعبة فقط ولا يوزع الأدوار بنفسه.",
    rule2Title: "2. التعرف في الليلة الأولى",
    rule2Desc: "في الليل الأول، يسأل التطبيق كل صاحب دور خاص (المافيا، المحقق، الطبيب): 'من أنت؟' ليتعرف عليه بسرية دون أن يعلم بقية اللاعبين.",
    rule3Title: "3. السرية التامة والأصوات المنبهة",
    rule3Desc: "يُصدر التطبيق نغمات صوتية محلية لتنبيه الدور القادم لفتح عينيه، مع شاشة سوداء آمنة لمدة 6 ثوانٍ بين الأدوار لمنع التلصص.",
    rule4Title: "4. كشف الكرت الورقي",
    rule4Desc: "عند تصفية أو طرد أي لاعب، ينبهكم التطبيق لمطالبته بكشف كرته الورقي وفقاً لقواعدكم المنزلية المعتادة.",
    cannotSelectSelf: "لا يمكنك اختيار نفسك كهدف.",
    androidCodeExport: "كود أندرويد Jetpack Compose",
    androidCodeTitle: "كود Kotlin الأصلي لتطبيق أندرويد",
    androidCodeSubtitle: "كود كامل وجاهز للتشغيل بأندرويد ستوديو متوافق مع نظام هذا التطبيق تماماً.",
    copyCode: "نسخ الكود",
    copied: "تم النسخ!",
    downloadKt: "تحميل الملف (.kt)",
    moderatorMenu: "غرفة المنظم والمجلس",
    chronicleTitle: "سجل أحداث المباراة",
    chronicleEmpty: "لا توجد أحداث مسجلة بعد. سيبدأ السجل مع تعاقب الليل والنهار.",
    soundboardTitle: "المؤثرات الصوتية وطقوس المجلس",
    soundboardDesc: "أطلق نغمات وطقوس صوتية حقيقية للمجلس مباشرة دون إنترنت.",
    soundGong: "ناقوس الليل",
    soundGavel: "مطرقة المنظم",
    soundHeartbeat: "نبضات التوتر",
    soundDawn: "أجراس الصباح",
    soundInspect: "رنين الفحص",
    soundHeal: "ترياق الشفاء",
    soundWind: "رياح الليل",
    councilRosterTitle: "حالة أعضاء المجلس",
    aliveCitizens: "الأحياء في المجلس",
    fallenCitizens: "الذين غادروا الحياة",
    abandonGameTitle: "إنهاء المباراة الحالية؟",
    abandonGamePrompt: "هل أنت متأكد من رغبتك في إلغاء هذه المباراة والعودة إلى الشاشة الرئيسية؟",
    abandonConfirm: "نعم، إنهاء المباراة",
    roleSettings: "إعدادات بطاقات الأدوار الخاصة",
    enableDetectiveLabel: "تفعيل دور المحقق في الكروت",
    enableDoctorLabel: "تفعيل دور الطبيب في الكروت",
    hapticFeedbackLabel: "الاهتزاز اللمسي مع الكروت والأزرار",
    reorderSeats: "ترتيب مقاعد الجلوس حول الطاولة",
    moveUp: "تقديم المقعد",
    moveDown: "تأخير المقعد",
    saveRoster: "حفظ أسماء المجموعة",
    loadRoster: "استرجاع مجموعة سابقة",
    savedRosters: "مجموعات الأصدقاء المحفوظة",
    rosterSavedSuccess: "تم حفظ أسماء المجموعة بنجاح!",
    enterRosterName: "اسم المجموعة (مثال: أصدقاء السهرة):"
  }
};

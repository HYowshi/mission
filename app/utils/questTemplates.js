// utils/questTemplates.js

export const QUEST_TEMPLATES = [
  // ==========================================
  // 1. SỨC MẠNH (STRENGTH)
  // ==========================================
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Tổ Hợp Sinh Tồn Nền Tảng', 
    descM: 'Hoàn thành tổ hợp rèn luyện:\n- Hít đất: {val} cái\n- Squat: {val} cái\n- Gập bụng: {val} cái\n- Plank: {val} giây\n- Chạy tại chỗ: 30 giây\n- Nâng cao đùi: 30 giây', 
    descF: 'Hoàn thành tổ hợp rèn luyện:\n- Hít đất (chống gối): {val} cái\n- Squat: {val} cái\n- Gập bụng: {val} cái\n- Plank: {val} giây\n- Chạy tại chỗ: 30 giây\n- Nâng cao đùi: 30 giây', 
    reward: 0.02, baseM: 10, baseF: 5, stepM: 2, stepF: 1, minStreak: 1, 
    loadFactor: 1.5, isExplosive: false, isPhysical: true,
    successMsg: 'Tổ hợp hoàn tất. Toàn bộ các nhóm cơ cốt lõi đang tản ra nhiệt lượng.'
  },
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Khai Mở Thể Phách (Push-up)', 
    descM: 'Thực hiện {val} cái hít đất tiêu chuẩn. Giữ lưng thẳng, bung sức đẩy lên.',
    descF: 'Thực hiện {val} cái hít đất (chống gối hoặc trên bục). Ưu tiên tư thế chuẩn.',
    reward: 0.01, baseM: 10, baseF: 5, stepM: 5, stepF: 2, minStreak: 1, 
    loadFactor: 1, isExplosive: false, isPhysical: true,
    successMsg: 'Cơ ngực và cơ tay sau được tái tổ hợp, tăng cường mật độ sợi cơ.'
  },
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Sức Trụ Trái Đất (Squat)', 
    descM: 'Thực hiện {val} cái Squat. Gồng chặt cơ trọng tâm, dồn lực vào gót chân.',
    descF: 'Thực hiện {val} cái Squat (tập trung cơ mông). Mở rộng mũi chân để siết đùi trong.',
    reward: 0.01, baseM: 15, baseF: 15, stepM: 5, stepF: 5, minStreak: 1, 
    loadFactor: 0.8, isExplosive: false, isPhysical: true,
    successMsg: 'Nền tảng thân dưới vững chắc hơn. Khớp gối và cơ đùi gia tăng sức mạnh.'
  },
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Bọc Giáp Cốt Lõi (Gập bụng)', 
    desc: 'Thực hiện {val} cái gập bụng (Crunch/Sit-up). Tập trung siết cơ bụng, không dùng lực cổ.', 
    reward: 0.01, baseM: 15, baseF: 10, stepM: 5, stepF: 5, minStreak: 1, 
    loadFactor: 0.5, isExplosive: false, isPhysical: true,
    successMsg: 'Cơ bụng co thắt sinh nhiệt. Lớp giáp cốt lõi đang dần hình thành.'
  },
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Giam Cầm Thể Xác (Plank)', 
    desc: 'Giữ tư thế Plank chuẩn trong {val} giây. Không để võng phần thắt lưng.', 
    reward: 0.01, baseM: 20, baseF: 15, stepM: 10, stepF: 5, minStreak: 1, 
    loadFactor: 0.2, isExplosive: false, isPhysical: true, timerUnit: 'giây',
    successMsg: 'Cơ trọng tâm đang khóa chặt. Ý chí chiến thắng sự phản kháng của thể xác.'
  },
  { 
    type: 'dynamic', statKey: 'strength', statName: 'Sức Mạnh', title: 'Nén Gồng Cực Hạn (Tempo Push-up)', 
    desc: 'Thực hiện {val} cái chống đẩy cực chậm (Hạ xuống 3s, Đẩy lên 1s).', 
    reward: 0.02, baseM: 5, baseF: 3, stepM: 2, stepF: 1, minStreak: 5, 
    loadFactor: 1.5, isExplosive: false, isPhysical: true,
    successMsg: 'Time Under Tension đạt đỉnh. Cơ bắp bị xé rạn để phát triển mạnh mẽ hơn.'
  },

  // ==========================================
  // 2. NHANH NHẸN (AGILITY)
  // ==========================================
  { 
    type: 'dynamic', statKey: 'agility', statName: 'Nhanh Nhẹn', title: 'Gia Tốc Toàn Thân (Jumping Jacks)', 
    desc: 'Chuỗi Jumping Jacks (Nhảy dang tay chân) {val} cái liên tục tốc độ cao.',
    reward: 0.01, baseM: 30, baseF: 30, stepM: 10, stepF: 10, minStreak: 1, 
    loadFactor: 0.5, isExplosive: true, isPhysical: true,
    successMsg: 'Nhịp tim tăng tốc bóp máu đi toàn thân. Phản xạ hệ thần kinh nhạy bén hơn.'
  },
  { 
    type: 'dynamic', statKey: 'agility', statName: 'Nhanh Nhẹn', title: 'Xé Toạc Không Gian (Chạy Nước Rút)', 
    desc: 'Chạy nước rút 100m lặp lại {val} lần (Nghỉ 30s giữa các lần).', 
    reward: 0.02, baseM: 3, baseF: 2, stepM: 1, stepF: 1, minStreak: 7, 
    loadFactor: 3.0, isExplosive: true, isPhysical: true,
    successMsg: 'Sợi cơ co giật nhanh (Type II) được kích hoạt toàn diện. Tốc độ vượt giới hạn.'
  },
  { 
    type: 'dynamic', statKey: 'agility', statName: 'Nhanh Nhẹn', title: 'Thách Thức Trọng Lực (Leo cầu thang)', 
    desc: 'Leo liên tục {val} tầng cầu thang (Hoặc bước lên ghế bục {val}x5 lần).', 
    reward: 0.01, baseM: 3, baseF: 2, stepM: 1, stepF: 1, minStreak: 3, 
    loadFactor: 1.0, isExplosive: false, isPhysical: true,
    successMsg: 'Cơ đùi trước và bắp chân hoạt động hết công suất chống lại trọng lực.'
  },
  { 
    type: 'dynamic', statKey: 'agility', statName: 'Nhanh Nhẹn', title: 'Bộ Pháp Luân Chuyển (Shuffle)', 
    desc: 'Di chuyển ngang (Shuffle) sang trái phải liên tục trong {val} giây. Giữ trọng tâm thấp.', 
    reward: 0.01, baseM: 60, baseF: 60, stepM: 30, stepF: 30, minStreak: 4, 
    loadFactor: 0.5, isExplosive: true, isPhysical: true, timerUnit: 'giây',
    successMsg: 'Độ cơ động phương ngang được thiết lập. Sẵn sàng né tránh mọi nguy hiểm.'
  },

  // ==========================================
  // 3. SỨC BỀN (STAMINA)
  // ==========================================
  { 
    type: 'dynamic', statKey: 'stamina', statName: 'Sức Bền', title: 'Hô Hấp Cực Đoan (Chạy 2-3km)', 
    desc: 'Chạy bền hoặc đi bộ tốc độ cao trong tối thiểu {val} phút.',
    reward: 0.02, baseM: 10, baseF: 10, stepM: 2, stepF: 2, minStreak: 1, 
    loadFactor: 2.0, isExplosive: false, isPhysical: true, timerUnit: 'phút',
    successMsg: 'Dung tích phổi mở rộng. Tim bơm máu với hiệu suất tối đa.'
  },
  { 
    type: 'dynamic', statKey: 'stamina', statName: 'Sức Bền', title: 'Hành Trình Ngàn Dặm', 
    desc: 'Tích lũy {val} bước chân trong ngày hôm nay.', 
    reward: 0.01, baseM: 3000, baseF: 3000, stepM: 500, stepF: 500, minStreak: 1,
    loadFactor: 0.002, isExplosive: false, isPhysical: true, requirePedometer: true,
    successMsg: 'Kháng cự sự trì trệ thành công. Năng lượng cơ thể duy trì trạng thái động.'
  },
  { 
    type: 'dynamic', statKey: 'stamina', statName: 'Sức Bền', title: 'Vòng Quay Bất Tận (Đạp xe)', 
    desc: 'Đạp xe ngoài trời/máy (hoặc nằm đạp xe không khí) liên tục trong {val} phút.', 
    reward: 0.01, baseM: 10, baseF: 10, stepM: 5, stepF: 5, minStreak: 3, 
    loadFactor: 1.5, isExplosive: false, isPhysical: true, timerUnit: 'phút',
    successMsg: 'Sức bền cơ bắp chi dưới được mài giũa. Lượng calo dư thừa đang bốc hơi.'
  },
  { 
    type: 'static', statKey: 'stamina', statName: 'Sức Bền', title: 'Kháng Cự Sự Trì Trệ', 
    desc: 'Tuyệt đối không ngồi một chỗ liên tục quá 1 tiếng trong ngày hôm nay (hãy đứng dậy đi lại).', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Ngăn chặn thành công chứng thoái hóa cột sống do ngồi lâu.'
  },

  // ==========================================
  // 4. TRÍ TUỆ (INTELLIGENCE)
  // ==========================================
  { 
    type: 'dynamic', statKey: 'intelligence', statName: 'Trí Tuệ', title: 'Trạng Thái Vô Ngã (Pomodoro Focus)', 
    desc: 'Hoàn thành {val} chu kỳ Pomodoro (25p Focus / 5p Nghỉ) để học tập hoặc làm việc.', 
    reward: 0.01, baseM: 1, baseF: 1, stepM: 1, stepF: 1, minStreak: 1, 
    loadFactor: 10, isExplosive: false, isPhysical: false, timerUnit: 'pomodoro',
    successMsg: 'Sóng não tiến vào tần số Alpha. Tốc độ xử lý thông tin thùy trán gia tăng mạnh.'
  },
  { 
    type: 'dynamic', statKey: 'intelligence', statName: 'Trí Tuệ', title: 'Dung Nạp Tri Thức (Đọc sách)', 
    desc: 'Đọc và chiêm nghiệm {val} trang sách kiến thức/kỹ năng (Không tính truyện giải trí).', 
    reward: 0.01, baseM: 5, baseF: 5, stepM: 2, stepF: 2, minStreak: 1, 
    loadFactor: 2, isExplosive: false, isPhysical: false,
    successMsg: 'Dữ liệu mới được nén vào Vỏ Não. Thế giới quan đang được mở rộng.'
  },
  { 
    type: 'dynamic', statKey: 'intelligence', statName: 'Trí Tuệ', title: 'Giải Mã Ma Trận (Bài tập)', 
    desc: 'Hoàn thành {val} bài tập (Toán, Code, Ngoại ngữ) hoặc câu đố tư duy logic.', 
    reward: 0.02, baseM: 5, baseF: 5, stepM: 2, stepF: 2, minStreak: 3, 
    loadFactor: 5, isExplosive: false, isPhysical: false,
    successMsg: 'Các nơ-ron thần kinh chớp sáng kết nối với nhau. Tư duy logic sắc bén hơn.'
  },
  { 
    type: 'static', statKey: 'intelligence', statName: 'Trí Tuệ', title: 'Nén Dữ Liệu Bộ Não', 
    desc: 'Viết tóm tắt 1 trang giấy về một khái niệm/kiến thức phức tạp mà bạn mới học được.', 
    reward: 0.02, minStreak: 5, loadFactor: 5, isExplosive: false, isPhysical: false,
    successMsg: 'Khả năng tổng hợp và tóm lược thông tin đạt mức độ tinh vi.'
  },
  { 
    type: 'static', statKey: 'intelligence', statName: 'Trí Tuệ', title: 'Hấp Thụ Tinh Hoa', 
    desc: 'Xem 1 bài giảng, podcast học thuật và ghi chú lại những điểm quan trọng nhất.', 
    reward: 0.01, minStreak: 2, loadFactor: 5, isExplosive: false, isPhysical: false,
    successMsg: 'Mở rộng bộ nhớ đệm (RAM) của não bộ. Kiến thức đã được đồng bộ hóa.'
  },

  // ==========================================
  // 5. NGOẠI HÌNH (APPEARANCE)
  // ==========================================
  { 
    type: 'static', statKey: 'appearance', statName: 'Ngoại Hình', title: 'Thanh Tẩy Tạp Chất', 
    desc: 'Tắm rửa sạch sẽ và vệ sinh cá nhân cơ bản (đánh răng, rửa mặt).', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Lớp tạp chất bị gột rửa. Cơ thể phát ra sự tươi mới, sạch sẽ.'
  },
  { 
    type: 'static', statKey: 'appearance', statName: 'Ngoại Hình', title: 'Tu Sửa Giao Diện', 
    descM: 'Cắt tỉa móng tay, cạo râu, chải tóc gọn gàng. Sử dụng Skincare cơ bản nếu có.', 
    descF: 'Thực hiện quy trình Skincare đầy đủ, chăm sóc da, móng tay và tóc tai gọn gàng.', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Giao diện bên ngoài đã được nâng cấp. Sức hấp dẫn vật lý gia tăng.'
  },
  { 
    type: 'static', statKey: 'appearance', statName: 'Ngoại Hình', title: 'Cấu Trúc Không Gian', 
    desc: 'Dọn dẹp phòng ngủ, gấp chăn màn hoặc lau dọn bàn làm việc gọn gàng.', 
    reward: 0.01, minStreak: 1, loadFactor: 0.5, isExplosive: false, isPhysical: true,
    successMsg: 'Trường năng lượng xung quanh được định hình lại. Phong thái Ký chủ tỏa sáng hơn.'
  },
  { 
    type: 'static', statKey: 'appearance', statName: 'Ngoại Hình', title: 'Bổ Sung Thủy Nguyên Tố', 
    desc: 'Uống đủ lượng nước (1.5 - 2 lít) trong ngày hôm nay.', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Mật độ nước trong tế bào đạt mức hoàn hảo. Da dẻ căng bóng và khỏe mạnh.'
  },

  // ==========================================
  // 6. MAY MẮN (LUCK)
  // ==========================================
  { 
    type: 'static', statKey: 'luck', statName: 'May Mắn', title: 'Nghi Thức Nhân Quả', 
    desc: 'Khen ngợi chân thành một người xung quanh hoặc giúp đỡ ai đó một việc nhỏ.', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Một hạt giống thiện lành được gieo xuống. Tần số may mắn của vũ trụ đang mỉm cười.'
  },
  { 
    type: 'static', statKey: 'luck', statName: 'May Mắn', title: 'Canh Bạc Của Khởi Nguyên', 
    desc: 'Tung đồng xu để đưa ra một quyết định ngẫu nhiên trong ngày hôm nay.', 
    reward: 0.01, minStreak: 1, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Ngài phó mặc một phần số phận cho xác suất. Khả năng bẻ cong vận mệnh tăng cường.'
  },
  { 
    type: 'static', statKey: 'luck', statName: 'May Mắn', title: 'Đoạt Mệnh Thiên Cơ', 
    desc: 'Tham gia một sự kiện ngẫu nhiên (bốc thăm, chơi mini-game, sự kiện bất ngờ) để thử vận mệnh.', 
    reward: 0.02, minStreak: 3, loadFactor: 0, isExplosive: false, isPhysical: false,
    successMsg: 'Can thiệp trực tiếp vào dòng chảy xác suất. Trực giác linh cảm tăng vọt.'
  },
];
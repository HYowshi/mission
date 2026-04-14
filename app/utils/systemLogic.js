// utils/systemLogic.js

// 1. Hàm tạo chỉ số ngẫu nhiên từ 5 đến 10 (có thể có số thập phân nhỏ gọn)
export const generateRandomStat = () => {
  const min = 5;
  const max = 10;
  // Tạo số ngẫu nhiên, làm tròn đến 1 chữ số thập phân (VD: 6.5, 8.2)
  return (Math.random() * (max - min) + min).toFixed(1); 
};

// 2. Hàm tính toán màu sắc Giao diện dựa trên Dữ liệu cá nhân
export const calculateThemeColor = (systemId, fullName, dobString, gender) => {
  // systemId: số (VD: 1, 2)
  // fullName: chuỗi (VD: "Nguyen Van A")
  // dobString: chuỗi ngày sinh (VD: "15/08/2000" -> tính tổng các số)
  // gender: "Nam" hoặc "Nữ"

  const nameLength = fullName.replace(/\s/g, '').length; // Số ký tự tên (bỏ khoảng trắng)
  
  // Tính tổng các con số trong ngày sinh
  const dobSum = dobString.match(/\d/g)?.reduce((a, b) => parseInt(a) + parseInt(b), 0) || 0;
  
  const genderValue = gender.toLowerCase() === 'nam' ? 1 : 0;

  // Công thức của bạn: ID + Ký tự tên + Tổng ngày sinh + Giới tính
  const magicNumber = systemId + nameLength + dobSum + genderValue;

  // Sử dụng magicNumber để tạo ra một góc màu Hue (từ 0 đến 360 độ)
  const hue = (magicNumber * 37) % 360; // Nhân 37 để tạo độ phân tán màu tốt hơn
  
  // Trả về mã màu HSL (Màu sắc tươi sáng phù hợp làm giao diện)
  return `hsl(${hue}, 70%, 50%)`; 
};

// 3. Ngân hàng câu hỏi gián tiếp của Hệ Thống (Tạo sự đa dạng)
export const systemDialogues = {
  name: [
    "Dữ liệu linh hồn của ngài đang trống. Ký chủ thường được những sinh vật khác gọi bằng danh xưng gì?",
    "Quá trình đồng bộ cần một định danh. Ở tinh cầu này, tên của ngài là gì?",
    "Xin chào. Để tôi dễ xưng hô, ngài muốn tôi gọi ngài là gì?"
  ],
  gender: [
    "Cấu trúc sinh học của ngài thuộc dạng nào? Nam hay Nữ? Để tôi tinh chỉnh cho phù hợp.",
    "Hệ thống quét thấy sự sống, nhưng cần xác nhận vật lý: Cấu trúc của ngài là Nam hay Nữ?",
  ],
  dob: [
    "Dòng thời gian tại đây khá kỳ lạ. Ký chủ đã xuất hiện trên cõi đời này vào ngày tháng năm nào?",
    "Để đối chiếu với lịch sử tinh cầu, xin hãy cho biết ngày ngài cất tiếng khóc chào đời (dd/mm/yyyy)."
  ]
};
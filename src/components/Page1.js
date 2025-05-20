import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const IndexPage = () => {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  // Hàm kết nối ví
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setConnected(true);
      } catch (error) {
        alert("Kết nối ví thất bại!");
      }
    } else {
      alert("MetaMask không được phát hiện!");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Ảnh nền toàn màn hình */}
      <img
        src="/anhnen1.png" // Đảm bảo ảnh này có trong thư mục public
        alt="Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1, // Đảm bảo ảnh nền luôn ở dưới
        }}
      />

      {/* Nút "Connect" nằm chính giữa với hiệu ứng hoạt hình */}
      <button
        onClick={connectWallet}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "15px 30px",
          backgroundColor: connected ? "green" : "blue",
          color: "white",
          border: "none",
          borderRadius: "12x",
          fontSize: "30px",
          cursor: "pointer",
          animation: connected ? "none" : "pulse 1s infinite", // Thêm hoạt hình pulse khi chưa kết nối
        }}
      >
        {connected ? "✓ Kết nối thành công" : "Kết nối ví"}
      </button>

      {/* Ảnh thứ 2 nằm ở góc dưới bên phải gần cuối trang */}
      {connected && (
        <img
          src="/anh2.jpg" // Đảm bảo ảnh này có trong thư mục public
          alt="Next"
          onClick={() => navigate("/page2")}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "100px",
            cursor: "pointer",
            animation: "fadeIn 1s ease-in-out", // Thêm hiệu ứng fadeIn cho ảnh khi ví kết nối
          }}
        />
      )}

      {/* Thêm CSS cho hoạt hình */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default IndexPage;

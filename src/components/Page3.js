import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

const Page3 = () => {
  const [account, setAccount] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    loadAccount();

    const data = JSON.parse(localStorage.getItem("savedData")) || [];
    setSavedData(data);
  }, []);

  const handleRowSelect = (data) => {
    setSelectedData(data);
    setShowDetails(false);
  };

  const handleCheck = () => {
    if (!selectedData) {
      alert("Vui lòng chọn một dòng để kiểm tra!");
      return;
    }
    setShowDetails(true);
  };

  // Hàm kiểm tra số lần xuất hiện của mã hash
  const getHashCount = (currentHash) => {
    return savedData.filter((data) => data.fileHash === currentHash).length;
  };

  // Lưu trữ các mã hash đã kiểm tra, giúp phân biệt lần đầu tiên và các lần sau
  const hashTracker = {};

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: "url('/anh3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "pink" }}>LỊCH SỬ XÁC MINH</h1>

      {account && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <p style={{ color: "white" }}>Ví đã kết nối: {account}</p>
        </div>
      )}

      {savedData.length > 0 ? (
        <div style={{ margin: "20px auto", maxWidth: "80%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>STT</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Mã Hash</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tên Tệp</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Kích thước</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Hành động</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Loại Dữ Liệu</th>
              </tr>
            </thead>
            <tbody>
              {savedData.map((data, index) => {
                // Kiểm tra số lần xuất hiện của mã hash
                const hashCount = getHashCount(data.fileHash);
                let dataType = "Dữ liệu gốc";

                // Nếu mã hash đã xuất hiện trước đó, đánh dấu là "Dữ liệu đã thay đổi"
                if (hashTracker[data.fileHash]) {
                  dataType = "Dữ liệu đã thay đổi";
                } else {
                  // Đánh dấu mã hash này là đã xuất hiện lần đầu
                  hashTracker[data.fileHash] = true;
                }

                return (
                  <tr
                    key={index}
                    onClick={() => handleRowSelect(data)}
                    style={{
                      backgroundColor:
                        selectedData === data ? "#f1f1f1" : index % 2 === 0 ? "#f9f9f9" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {index + 1}
                    </td>
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {data.fileHash}
                    </td>
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {data.fileName}
                    </td>
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {(data.fileSize / 1024).toFixed(2)} KB
                    </td>
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {selectedData === data ? "Đã chọn" : "Chọn"}
                    </td>
                    <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                      {dataType}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          <p>Chưa có dữ liệu nào được lưu vào ví.</p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleCheck}
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Kiểm tra
        </button>
        <button
          onClick={() => navigate("/page2")}
          style={{
            padding: "10px 20px",
            backgroundColor: "orange",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Quay lại trang 2
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Trang chủ
        </button>
      </div>

      {showDetails && selectedData && (
        <div
          style={{
            margin: "20px auto",
            maxWidth: "80%",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Chi tiết giao dịch</h2>
          <p><strong>Mã Hash:</strong> {selectedData.fileHash}</p>
          <p><strong>Tên tệp:</strong> {selectedData.fileName}</p>
          <p><strong>Kích thước:</strong> {(selectedData.fileSize / 1024).toFixed(2)} KB</p>
          <p><strong>Loại tệp:</strong> {selectedData.fileType}</p>
          <p><strong>Chi tiết Gas và Giao dịch:</strong></p>
          <ul>
            <li>Gas đã dùng: 21,512</li>
            <li>Tổng phí Gas: 0.000065 ETH</li>
            <li>Phí USD: $0.24</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page3;

// src/components/ConnectWallet.js
import React, { useState } from "react";
import Web3 from "web3";

function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);

  // Hàm kết nối ví MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Khởi tạo Web3 từ MetaMask
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Yêu cầu quyền truy cập tài khoản MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Lấy tài khoản đầu tiên từ MetaMask
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setIsConnected(true);

        // Lắng nghe sự kiện thay đổi tài khoản
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
        });

        // Lắng nghe sự kiện thay đổi mạng (network)
        window.ethereum.on("chainChanged", (chainId) => {
          window.location.reload(); // Tải lại trang khi mạng thay đổi
        });
      } catch (error) {
        console.error("Lỗi khi kết nối MetaMask:", error);
        alert("Không thể kết nối với MetaMask.");
      }
    } else {
      alert("MetaMask không được cài đặt trên trình duyệt.");
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={connectWallet}>Kết nối ví MetaMask</button>
      ) : (
        <div>
          <p>Đã kết nối với ví MetaMask</p>
          <p>Tài khoản: {account}</p>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const Page2 = () => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileHash, setFileHash] = useState("");
  const [account, setAccount] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [showData, setShowData] = useState(false);
  const [existingFileHash, setExistingFileHash] = useState(null);  // Store previous file hash
  const [isFileChanged, setIsFileChanged] = useState(false);  // Track if file has changed
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);

  // Connect wallet on page load
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("User rejected the connection:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    connectWallet();
  }, []);

  // Handle file selection and calculate file hash
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      setFileSize(file.size);

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const hash = Web3.utils.sha3(uint8Array);
        setFileHash(hash);

        // Check if the file already exists in localStorage
        const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
        const existingFile = savedData.find(item => item.fileHash === hash);

        if (existingFile) {
          // File already exists, show alert
          alert("This file has already been saved!");
          setFileSelected(false);
        } else {
          // New file, no change
          setExistingFileHash(fileHash);  // Store current hash to check later
          setIsFileChanged(false);  // Reset file change status
          setFileSelected(true);
          setShowData(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Show file data when user clicks "OK"
  const handleShowData = () => {
    setShowData(true);
  };

  // Reset file selection
  const handleFileReset = () => {
    setFileName("");
    setFileType("");
    setFileSize(0);
    setFileHash("");
    setFileSelected(false);
    setShowData(false);
    setIsFileChanged(false);
  };

  // Save file data to wallet (MetaMask)
  const handleSaveToWallet = async () => {
    if (!fileHash || !account) {
      alert("Please select a file and make sure you're connected to MetaMask!");
      return;
    }

    if (fileHash !== existingFileHash && !isFileChanged) {
      // File has changed, confirm with the user
      const confirmSave = window.confirm("The file has changed. Do you want to save the new file?");
      if (!confirmSave) {
        return;
      }
      setIsFileChanged(true);  // Mark the file as changed
    }

    try {
      const tx = {
        from: account,
        to: account,
        value: "0",  // No ETH sent
        data: web3.utils.toHex(fileHash),  // Send file hash as data
      };

      // Send transaction and request confirmation from MetaMask
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });

      alert(`Transaction confirmed! Transaction hash: ${txHash}`);

      // Save transaction data to localStorage after successful confirmation
      const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
      savedData.push({ fileName, fileHash, fileType, fileSize, txHash });
      localStorage.setItem("savedData", JSON.stringify(savedData));
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Transaction was rejected or an error occurred.");
    }
  };

  // Redirect to history page
  const handleHistoryRedirect = () => {
    navigate("/page3");
  };

  return (
    <div style={{ position: "relative", height: "100vh", padding: "20px" }}>
      {/* Background image */}
      <img
        src="/anhnen3.jpg"
        alt="Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />

      {/* Title */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2cm" }}>
        <div
          style={{
            textAlign: "center",
            backgroundColor: "blue",
            color: "red",
            padding: "15px 30px",
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "28px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          XÁC MINH TÀI LIỆU BLOCKCHAIN
        </div>
      </div>

      {/* Connected wallet display */}
      {account && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <p>Connected Wallet: {account}</p>
        </div>
      )}

      {/* File selection and buttons */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* OK and Reset buttons */}
      {fileSelected && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={handleShowData}
            style={{
              display: "inline-block",
              marginRight: "20px",
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            OK
          </button>
          <button
            onClick={handleFileReset}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Select Another File
          </button>
        </div>
      )}

      {/* Show file data */}
      {showData && (
        <div
          style={{
            width: "60%",
            margin: "20px auto",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "white",
            color: "black",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "10px",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              borderRadius: "4px",
              textAlign: "left",
            }}
          >
            <h4>File Information</h4>
            <p><strong>File Name:</strong> {fileName}</p>
            <p><strong>File Type:</strong> {fileType}</p>
            <p><strong>File Size:</strong> {(fileSize / 1024).toFixed(2)} KB</p>
          </div>

          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <h4>File Hash</h4>
            <p>{fileHash}</p>
          </div>
        </div>
      )}

      {/* Save to wallet button */}
      {showData && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleSaveToWallet}
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save to Wallet
          </button>
        </div>
      )}

      {/* History redirect button */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={handleHistoryRedirect}
          style={{
            padding: "10px 20px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          History
        </button>
      </div>
    </div>
  );
};

export default Page2;

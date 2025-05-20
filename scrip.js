// Địa chỉ và ABI của hợp đồng (Copy từ Remix)
const contractAddress = "0x30ad18625dd8756D003E1DD1695b980D73b1B8f6";
const contractABI = [
        [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_hash",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_owner",
                        "type": "string"
                    }
                ],
                "name": "addDocument",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_hash",
                        "type": "string"
                    }
                ],
                "name": "getDocument",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
];

// Kết nối với MetaMask
let web3;
let account;

const connectWallet = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("output").innerText = `Đã kết nối với tài khoản: ${account}`;
    } else {
        alert("MetaMask không được phát hiện!");
    }
};

// Khởi tạo hợp đồng
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Tải file lên và lưu trữ
const uploadFile = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Vui lòng chọn một tệp!");
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const fileHash = web3.utils.sha3(reader.result); // Tạo hash từ nội dung file
        await contract.methods.addDocument(fileHash, account).send({ from: account });

        document.getElementById("output").innerText = `Tệp đã được lưu trữ với hash: ${fileHash}`;
    };

    reader.readAsBinaryString(file);
};

// Lấy thông tin tài liệu
const getDocument = async (hash) => {
    const document = await contract.methods.getDocument(hash).call();
    console.log("Thông tin tài liệu:", document);
    document.getElementById("output").innerText = `Hash: ${document[0]}, Owner: ${document[1]}`;
};

// Gắn sự kiện vào các nút
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("uploadFile").onclick = uploadFile;

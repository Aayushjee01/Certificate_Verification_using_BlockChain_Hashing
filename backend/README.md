# ⛓️ Blockchain Certificate Verification Backend

This is the Node/Express backend for the Certificate Verification System. It handles PDF hashing and handles transactions on the blockchain using **ethers.js**.

## 🚀 Quick Start

### 1. Configure Environment
Update `backend/.env` with your provider RPC URL, private key, and contract address:
```env
PORT=5000
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address
```

### 2. Install & Run
```bash
cd backend
npm install
npm run start
```

## 🛠️ API Reference

### Upload Certificate
- **Endpoint**: `POST /api/certificates/upload`
- **Body**: `multipart/form-data`
  - `certificate`: (File, PDF only)
- **Response**:
```json
{
  "success": true,
  "message": "Certificate uploaded successfully",
  "data": {
    "certificateHash": "...",
    "transactionHash": "..."
  }
}
```

### Verify Certificate
- **Endpoint**: `POST /api/certificates/verify`
- **Body**: `multipart/form-data` OR `application/json`
  - `certificate`: (File, PDF only) - OR -
  - `hash`: (String, SHA-256 hash)
- **Response**:
```json
{
  "success": true,
  "message": "Certificate is valid",
  "data": {
    "isValid": true,
    "hash": "..."
  }
}
```

## 🔗 Connecting to React Frontend
You can now update your frontend fetch calls to:
```javascript
const formData = new FormData();
formData.append('certificate', file);

const response = await fetch('http://localhost:5000/api/certificates/upload', {
  method: 'POST',
  body: formData
});
const result = await response.json();
```

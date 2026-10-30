# Two-Laptop Collaboration & Handoff Protocol (No GitHub)

> [!NOTE]
> This guide outlines the workflow for developing SmallWebReader across two independent laptops without a central GitHub repository or internet-based version control.

---

## 1. Collaboration Roles

- **Laptop 1 (This Machine)**: Frontend application, UI/UX design, theme engine, reader components, client-side state.
- **Laptop 2**: Backend extraction service, web parsing, sanitization, optional persistence / database.

---

## 2. API Contract Exchange Process

1. **Contract Draft & Confirmation**:
   - The backend developer on Laptop 2 specifies the endpoint signatures (HTTP method, path, request JSON, response JSON, error codes).
   - This specification is shared as a Markdown file, JSON schema, or OpenAPI/Postman collection.
   - The frontend developer updates [API_CONTRACT.md](file:///Users/varneetsingh/Desktop/smallwebreader/docs/API_CONTRACT.md) to record the agreed contract.
2. **Version Pinning**:
   - Any modification to endpoint contracts must be communicated before backend implementation changes are deployed to avoid breaking local frontend builds.

---

## 3. Code & Artifact Sharing Methods

Without a central GitHub repository, changes between laptops should be shared using one of the following methods:

### Method A: Local Git Bundles / Zip Snapshots (Recommended)
- Export repository snapshots or git bundles to a shared USB drive or over AirDrop / local network share:
  ```bash
  # Create a git bundle (if git is initialized locally)
  git bundle create smallwebreader-frontend.bundle HEAD main
  
  # Alternatively, create an archive excluding node_modules
  tar --exclude='node_modules' --exclude='.next' --exclude='dist' -czvf frontend-snapshot.tar.gz .
  ```

### Method B: Direct Local Peer Transfer
- Use AirDrop (macOS to macOS), Local Wi-Fi network file sharing (SMB), or tools like LocalSend / Wormhole / Python HTTP server:
  ```bash
  # Quickly serve files over local Wi-Fi from terminal
  python3 -m http.server 8000
  ```

---

## 4. Local Network & Environment Configuration

To allow Laptop 1 (Frontend) to communicate directly with Laptop 2 (Backend) across a local Wi-Fi network or mobile hotspot:

1. **Discover Backend IP Address**:
   - On Laptop 2 (Backend), find the local IPv4 address:
     - macOS/Linux: `ipconfig getifaddr en0` or `ifconfig` / `ip a`
     - Windows: `ipconfig`
   - Example Backend IP: `192.168.1.45`, running on port `8080`.

2. **Frontend Environment Variable Configuration**:
   - Create a `.env.local` file on Laptop 1:
     ```env
     VITE_API_BASE_URL=http://192.168.1.45:8080
     # or for Next.js:
     NEXT_PUBLIC_API_BASE_URL=http://192.168.1.45:8080
     ```

3. **Backend CORS Setup**:
   - Laptop 2 backend must configure CORS headers to permit requests originating from the frontend origin (e.g., `http://localhost:3000` or `http://192.168.1.*`).
   - Access-Control-Allow-Origin: `*` (or specific local IP and port).
   - Access-Control-Allow-Methods: `GET, POST, OPTIONS`.
   - Access-Control-Allow-Headers: `Content-Type, Authorization`.

---

## 5. Integration Verification Checklist

Before conducting integrated testing or final demonstration:

1. **Step 1: Network Reachability**:
   - From Laptop 1, ping Laptop 2:
     ```bash
     ping 192.168.1.45
     ```
2. **Step 2: API Connectivity & Health Check**:
   - From Laptop 1, test the backend health endpoint using `curl`:
     ```bash
     curl -i http://192.168.1.45:8080/health
     ```
3. **Step 3: Extraction Verification**:
   - Run a test extraction request using `curl`:
     ```bash
     curl -i -X POST http://192.168.1.45:8080/api/extract \
       -H "Content-Type: application/json" \
       -d '{"url": "https://example.com"}'
     ```
4. **Step 4: End-to-End Browser Flow**:
   - Launch frontend (`npm run dev`), open browser, submit a sample article URL, and verify that the backend extraction payload renders cleanly in the Reader Canvas across all active themes.

# Two-Laptop Offline Collaboration & Handoff Guide

> [!NOTE]
> This protocol specifies the working procedures for developing SmallWebReader across two independent laptops without relying on GitHub or internet-based version control.

---

## 1. Machine Roles & Responsibilities

- **Laptop 1 (Frontend)**: User interface, reader canvas, typography engine, theme switcher, client state, and client-side sanitization.
- **Laptop 2 (Backend)**: Web page fetching, SSRF security validation, article content extraction, XSS sanitization, and REST API service.

---

## 2. API Contract Exchange Workflow

1. **Propose & Align**:
   - The backend developer provides proposed endpoint routes, JSON request bodies, success schemas, and error responses.
   - Address the current naming question: `/api/read` vs. `/api/extract`.
2. **Canonical Recording**:
   - The agreed specification is written into `docs/API_CONTRACT.md` and ratified in `docs/DECISIONS.md`.
   - The status is updated from `UNCONFIRMED / BLOCKED` to `CONFIRMED`.
3. **No Unilateral Changes**:
   - Neither developer modifies route paths, field names, or types without communicating the change and updating the canonical contract file first.

---

## 3. Code & Artifact Sharing Methods

Without a central GitHub repository, changes between laptops must be exchanged via physical media or direct local network transfer:

### Method A: Local Git Bundles (Recommended if Git is initialized)
```bash
# On Laptop 1 or 2, package all commits on main
git bundle create smallwebreader-update.bundle HEAD main

# On the receiving laptop, verify and pull
git bundle verify smallwebreader-update.bundle
git pull smallwebreader-update.bundle main
```

### Method B: Clean Tarball Archive
```bash
# Export clean snapshot excluding build artifacts and dependencies
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    -czvf smallwebreader-handoff.tar.gz .
```

### Method C: Local Network Peer Transfer
- Use macOS AirDrop, LocalSend, shared USB drives, or a temporary local Python server:
  ```bash
  # Serve current directory over local network
  python3 -m http.server 8000
  ```

---

## 4. Local Network & Environment Configuration

To allow Laptop 1 (Frontend) to reach the API server on Laptop 2 (Backend) across a local Wi-Fi or mobile hotspot:

1. **Determine Backend IP Address (Laptop 2)**:
   - macOS / Linux: `ipconfig getifaddr en0` or `ip a`
   - Windows: `ipconfig`
   - Example IP: `192.168.1.50`
2. **Configure Frontend Environment Variable (Laptop 1)**:
   - Create `.env.local` on Laptop 1:
     ```env
     # Adjust port and scheme to match Laptop 2
     VITE_API_BASE_URL=http://192.168.1.50:8080
     # or if Next.js:
     NEXT_PUBLIC_API_BASE_URL=http://192.168.1.50:8080
     ```
3. **Configure Backend CORS Headers (Laptop 2)**:
   - The backend must respond to preflight `OPTIONS` requests and allow requests from Laptop 1's dev origin:
     ```http
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: GET, POST, OPTIONS
     Access-Control-Allow-Headers: Content-Type, Authorization
     ```

---

## 5. Integration Verification Checklist

Execute these checks across the local network before declaring integration complete:

1. **Step 1: Network Ping**:
   ```bash
   # From Laptop 1, ping Laptop 2
   ping <LAPTOP_2_IP>
   ```
2. **Step 2: Backend Health Check**:
   ```bash
   # From Laptop 1, test reachability
   curl -i http://<LAPTOP_2_IP>:<PORT>/health
   ```
3. **Step 3: Extraction Verification (Contract Test)**:
   ```bash
   # NOTE: Replace <CONFIRMED_ENDPOINT> with the agreed path (e.g. /api/read or /api/extract)
   curl -i -X POST http://<LAPTOP_2_IP>:<PORT>/<CONFIRMED_ENDPOINT> \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
   ```
4. **Step 4: SSRF Security Rejection Check**:
   ```bash
   # Verify that requests to loopback / internal IPs are blocked safely
   curl -i -X POST http://<LAPTOP_2_IP>:<PORT>/<CONFIRMED_ENDPOINT> \
     -H "Content-Type: application/json" \
     -d '{"url": "http://127.0.0.1:8080"}'
   ```
5. **Step 5: End-to-End Browser Flow**:
   - Start frontend application on Laptop 1.
   - Enter a valid article URL into the UI.
   - Verify that the article renders cleanly without unhandled JavaScript exceptions.
   - Verify that error states are displayed gracefully when submitting an invalid or blocked URL.

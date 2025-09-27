# Agent Migration TODOs

This document outlines all the changes needed to migrate from the current agent to a new photo analysis agent that can handle photo uploads, item detection, and Amazon/Walmart integration.

## 🔧 **Core Agent Configuration**

### 1. Agent Name Changes
**Files to update:**
- `src/app/layout.tsx` - Line 34: Change `agent="sample_agent"` to new agent name
- `src/app/api/copilotkit/route.ts` - Line 14: Change agent name in CopilotRuntime
- `src/app/page.tsx` - Line 31: Change agent name in useCoAgent hook

**Current:** `sample_agent`
**Suggested:** `photo_analysis_agent`

### 2. Agent URL/Endpoint
**File:** `src/app/api/copilotkit/route.ts` - Line 15
**Current:** `url: "http://127.0.0.1:9000/run"`
**TODO:** Update to point to new photo analysis agent endpoint

## 🖼️ **Photo Analysis Integration**

### 3. Photo Upload Handler
**File:** `src/app/page.tsx` - Lines 1358-1363
**Current:** Mock implementation with setTimeout
**TODO:** Replace with actual agent call that:
- Accepts photo upload
- Analyzes image to detect items
- Returns structured item data with names, quantities, brands
- Optionally checks availability on Amazon/Walmart

### 4. New CopilotKit Actions Needed
**File:** `src/app/page.tsx` - Add new useCopilotAction hooks
**TODO:** Create actions for:
- `analyzePhoto` - Upload and analyze photos
- `detectItems` - Extract items from analyzed photos
- `checkAmazonAvailability` - Check item availability on Amazon
- `checkWalmartAvailability` - Check item availability on Walmart
- `addToAmazonCart` - Add items to Amazon cart
- `addToWalmartCart` - Add items to Walmart cart

## 🛒 **Shopping Cart Integration**

### 5. Cart Handlers
**File:** `src/app/page.tsx` - Lines 1421-1446
**Current:** Console.log placeholders
**TODO:** Integrate with new agent to:
- Check item availability on specified stores
- Get real-time pricing
- Add/remove items from store-specific carts
- Update UI with actual store data
- Validate quantity limits

### 6. Store API Integration
**TODO:** Implement integration with:
- Amazon Product Advertising API
- Walmart Open API
- Real-time price checking
- Inventory availability
- Cart management

## 📝 **Agent Instructions & Schema**

### 7. CopilotKit Instructions
**File:** `src/app/page.tsx` - Lines 144-149, 170-174
**Current:** Generic canvas instructions
**TODO:** Update for photo analysis agent:
- Photo analysis results
- Detected items with names, quantities, brands
- Amazon/Walmart availability and pricing
- Shopping cart management

### 8. Field Schema Updates
**File:** `src/app/page.tsx` - Lines 151-167
**Current:** Project/entity/note/chart schemas
**TODO:** Add schemas for:
- Photo analysis results
- Item detection data
- Store availability data
- Shopping cart items

## 🎨 **UI/UX Updates**

### 9. Chat Interface
**File:** `src/app/page.tsx` - Lines 1483-1504, 1552-1573
**Current:** Generic canvas suggestions
**TODO:** Update for photo analysis:
- "Analyze Photo" suggestion
- "Check Amazon Prices" suggestion
- "Check Walmart Prices" suggestion
- "Manage Shopping Carts" suggestion

### 10. Agent Title & Messages
**File:** `src/app/page.tsx` - Lines 1483, 1485, 1552, 1554
**Current:** "Agent" title, generic messages
**TODO:** Update to:
- "Photo Analysis Agent" title
- Photo-focused initial messages

## 🔄 **State Management**

### 11. New State Types
**File:** `src/lib/canvas/types.ts`
**TODO:** Add new types for:
- Photo analysis results
- Detected items
- Store availability data
- Shopping cart items

### 12. State Updates
**File:** `src/app/page.tsx` - Lines 1350-1352
**Current:** Basic extracted items state
**TODO:** Add state for:
- Photo analysis status
- Store availability data
- Shopping cart contents
- Price comparison data

## 🛠️ **Backend Agent Implementation**

### 13. New Agent Backend
**TODO:** Create new agent that can:
- Accept photo uploads
- Use computer vision to detect items
- Extract item details (name, quantity, brand)
- Check Amazon/Walmart APIs for availability
- Return structured data to frontend

### 14. API Endpoints
**TODO:** Create new endpoints:
- `/api/photo/analyze` - Photo analysis endpoint
- `/api/stores/amazon/check` - Amazon availability check
- `/api/stores/walmart/check` - Walmart availability check
- `/api/cart/amazon` - Amazon cart management
- `/api/cart/walmart` - Walmart cart management

## 📦 **Dependencies**

### 15. New Packages
**File:** `package.json`
**TODO:** Add dependencies for:
- Computer vision libraries (OpenCV, TensorFlow.js)
- Amazon Product Advertising API SDK
- Walmart Open API SDK
- Image processing libraries

## 🔐 **Environment Variables**

### 16. API Keys
**File:** `.env.local`
**TODO:** Add:
- Amazon Product Advertising API credentials
- Walmart Open API credentials
- Computer vision service API keys

## 📋 **Testing**

### 17. Test Cases
**TODO:** Create tests for:
- Photo upload and analysis
- Item detection accuracy
- Store availability checking
- Shopping cart functionality
- Error handling

## 🚀 **Deployment**

### 18. Production Configuration
**TODO:** Update for production:
- Agent endpoint URLs
- API rate limiting
- Error handling
- Monitoring and logging

---

## 📝 **Implementation Priority**

1. **High Priority:** Agent configuration changes (items 1-3)
2. **High Priority:** Photo analysis integration (items 3-4)
3. **Medium Priority:** Shopping cart integration (items 5-6)
4. **Medium Priority:** UI/UX updates (items 9-10)
5. **Low Priority:** Advanced features and optimizations (items 11-18)

## 🔍 **Code Locations Summary**

- **Agent Config:** `src/app/layout.tsx`, `src/app/api/copilotkit/route.ts`, `src/app/page.tsx`
- **Photo Analysis:** `src/app/page.tsx` (handlePhotoUpload function)
- **Shopping Carts:** `src/app/page.tsx` (cart handler functions)
- **UI Updates:** `src/app/page.tsx` (chat labels and suggestions)
- **New Components:** `src/components/PhotoUpload.tsx`, `src/components/ItemList.tsx`, `src/components/ShoppingCarts.tsx`

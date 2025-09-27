# SnapCart - Photo-Based Shopping Assistant

## New Features Added

### 1. Photo Upload System
- **Upload Button**: Large, prominent button for photo upload
- **File Selection**: Popup window with file picker for image selection
- **Preview & Confirmation**: Shows image preview with file details before upload
- **Processing State**: Visual feedback during AI processing

### 2. Item Extraction & Management
- **AI-Powered Detection**: Simulates AI extraction of items from photos
- **Item Details**: Each item shows:
  - Name (editable)
  - Quantity (adjustable)
  - Brand (dropdown with common brands)
  - Estimated price
- **Item Management**: Add, remove, or modify detected items
- **Confirmation Flow**: Review and confirm items before adding to carts

### 3. Shopping Cart System
- **Dual Store Support**: Separate carts for Amazon and Walmart
- **Quick Add**: One-click adding of items to either store
- **Cart Management**: 
  - Adjust quantities
  - Remove items
  - View totals
- **Checkout Integration**: Ready for store-specific checkout flows

### 4. Layout Structure
- **Left Sidebar**: CopilotKit chat interface (preserved)
- **Center Panel**: Photo upload and item list
- **Right Panel**: Shopping carts for both stores
- **Responsive Design**: Adapts to different screen sizes

## Technical Implementation

### Components Created
- `PhotoUpload.tsx`: Handles file selection and upload confirmation
- `ItemList.tsx`: Manages extracted items with editing capabilities
- `ShoppingCarts.tsx`: Dual-store shopping cart interface

### State Management
- Photo processing state
- Extracted items list
- Confirmed items for shopping
- Cart contents for both stores

### Mock Data
Currently uses mock data for demonstration:
- Nike Air Max 270 ($150)
- Apple iPhone 15 ($999)
- Coca-Cola Classic 6-pack ($4.99)

## Usage Flow
1. Upload a photo using the upload button
2. Review and edit detected items
3. Confirm items to proceed
4. Add items to Amazon or Walmart carts
5. Manage quantities and checkout

## Future Enhancements
- Real AI/ML integration for item detection
- Price comparison between stores
- Inventory management
- User accounts and saved carts
- Integration with actual store APIs

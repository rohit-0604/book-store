#!/bin/bash

echo "🧹 Cleaning up old files from the refactored Enhanced Bookstore..."

# Remove old Firebase-related files
echo "Removing Firebase files..."
rm -rf Client/src/firebase/
rm -rf Client/src/context/

# Remove old PrivateRoute (we created a new one)
echo "Removing old PrivateRoute..."
rm -rf Client/src/PrivateRoute/

# Remove old dashboard components (replaced with new dashboards)
echo "Removing old dashboard..."
rm -rf Client/src/dashboard/

# Clean up any old configuration files
echo "Removing old config files..."
rm -f Client/src/firebase.config.js
rm -f .firebase*

# Remove old dependencies from package.json if they exist
echo "Checking for old dependencies..."
if grep -q "firebase" Client/package.json; then
    echo "⚠️  Firebase dependency still exists in package.json"
    echo "Please remove it manually or run: npm uninstall firebase"
fi

# Remove old backend files if they exist
echo "Checking for old backend files..."
rm -f Server/config/
rm -f Server/firebase*

# Check for any other Firebase references
echo "Checking for remaining Firebase references..."
if grep -r "firebase" Client/src/ --include="*.js" --include="*.jsx" 2>/dev/null; then
    echo "⚠️  Found Firebase references that need manual cleanup"
else
    echo "✅ No Firebase references found"
fi

# Check for old import statements
echo "Checking for old import statements..."
if grep -r "AuthProvider\|useAuthContext" Client/src/ --include="*.js" --include="*.jsx" 2>/dev/null; then
    echo "⚠️  Found old context imports that need manual cleanup"
else
    echo "✅ No old context imports found"
fi

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "📋 Manual cleanup checklist:"
echo "  1. Remove 'firebase' from Client/package.json dependencies if present"
echo "  2. Run 'npm install' in the Client directory"
echo "  3. Check for any remaining import errors"
echo "  4. Test the application with 'npm run dev'"
echo ""
echo "✨ Your Enhanced Bookstore is now clean and ready!"
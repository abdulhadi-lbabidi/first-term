const fs = require('fs');
const file = 'd:/projects/vercel-hotels/src/pages/RoomDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change grid cols
content = content.replace(
  'className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-6 text-left rtl:text-right"',
  'className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-6 text-left rtl:text-right"'
);

// 2. Change Col 1 to span 3
content = content.replace(
  '{/* Column 1: Images | Amenities | Location Map */}\n        <div className="space-y-10 lg:col-span-1">',
  '{/* Column 1: Images | Amenities | Location Map | Reviews */}\n        <div className="space-y-10 lg:col-span-3">'
);

// 3. Change Col 2 to span 2 and sticky
content = content.replace(
  '{/* Column 2: Details Header | Description | Specs | Booking Table Form */}\n        <div className="space-y-10 lg:col-span-1">',
  '{/* Column 2: Details Header | Description | Specs | Booking Table Form */}\n        <div className="space-y-10 lg:col-span-2 lg:sticky lg:top-24">'
);

// 4. Move Reviews section. First, extract it.
const reviewsStartMarker = '{/* 3. Full-width Reviews List Section */}';
const recommendationsMarker = '{/* Recommendations Slider */}';

const reviewsStartIndex = content.indexOf(reviewsStartMarker);
const recommendationsIndex = content.indexOf(recommendationsMarker);

if (reviewsStartIndex > -1 && recommendationsIndex > -1) {
  const reviewsContent = content.substring(reviewsStartIndex, recommendationsIndex);
  
  // Remove reviews from original position
  content = content.slice(0, reviewsStartIndex) + content.slice(recommendationsIndex);
  
  // Find where Column 1 ends. Column 1 ends right before Column 2 starts.
  const col2Marker = '{/* Column 2: Details Header | Description | Specs | Booking Table Form */}';
  const col2Index = content.indexOf(col2Marker);
  
  if (col2Index > -1) {
    // Find the closing div of col 1
    const beforeCol2 = content.substring(0, col2Index);
    const lastDivMatch = beforeCol2.lastIndexOf('</div>');
    
    if (lastDivMatch > -1) {
      const newReviewsContent = reviewsContent
        .replace('section className="mt-20 pt-12 border-t', 'section className="pt-8 border-t')
        .replace('{/* 3. Full-width Reviews List Section */}', '{/* Reviews List Section */}');
      
      content = content.slice(0, lastDivMatch) + newReviewsContent + '        </div>\n\n        ' + content.slice(col2Index);
    }
  }
}

// 5. Implement "showAllReviews" logic
content = content.replace(
  '{reviews.map((rev) => {',
  '{(showAllReviews ? reviews : reviews.slice(0, 3)).map((rev) => {'
);

const noReviewsRegex = /<p className="text-\[14px\] text-muted italic text-left rtl:text-right">\{t\('rooms\.noReviews'\)\}<\/p>\s*\}\s*<\/div>/;
content = content.replace(noReviewsRegex, match => {
  return match + `
            {reviews.length > 3 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-primary font-semibold text-[14px] hover:underline"
                >
                  {showAllReviews 
                    ? (currentLang === 'ar' ? 'عرض أقل' : 'Show Less') 
                    : (currentLang === 'ar' ? 'عرض كل التقييمات' : 'View All Reviews')}
                </button>
              </div>
            )}`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('RoomDetails updated');

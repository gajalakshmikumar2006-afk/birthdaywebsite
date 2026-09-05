import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting End-to-End Verification Tests...\n');

  // Test 1: Check initial public letters (should be empty)
  console.log('1. Checking Public API GET /api/letters...');
  const res1 = await fetch(`${BASE_URL}/api/letters`);
  const data1 = await res1.json();
  console.log('   Response status:', res1.status);
  console.log('   Letters count:', data1.count);
  if (!data1.success || data1.count !== 0) throw new Error('Test 1 failed');
  console.log('   ✅ Test 1 Passed: Public endpoint works and returns empty list initially.\n');

  // Test 2: Word count limit rejection (> 150 words)
  console.log('2. Testing Word Count Cap (> 150 words)...');
  const longText = Array(155).fill('birthday').join(' ');
  const formFail = new FormData();
  formFail.append('name', 'Test Contributor');
  formFail.append('message', longText);

  // Generate a dummy 1x1 png image
  const dummyPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  formFail.append('images', new Blob([dummyPng], { type: 'image/png' }), 'sample.png');

  const res2 = await fetch(`${BASE_URL}/api/contributions`, {
    method: 'POST',
    body: formFail,
  });
  const data2 = await res2.json();
  console.log('   Status:', res2.status, 'Error:', data2.error);
  if (res2.status !== 400 || !data2.error.includes('150')) throw new Error('Test 2 failed');
  console.log('   ✅ Test 2 Passed: >150 words rejected properly by server.\n');

  // Test 3: Valid Contributor Submission with 3 photos
  console.log('3. Testing Valid Contributor Submission with multiple photos...');
  const formSuccess = new FormData();
  formSuccess.append('name', 'Arun Kumar');
  formSuccess.append(
    'message',
    'Happy 30th Birthday to the most amazing friend! May this milestone year bring you boundless happiness, endless adventures, and unforgettable memories. Grateful for all the laughter and good times we have shared together!'
  );
  formSuccess.append('images', new Blob([dummyPng], { type: 'image/png' }), 'photo1.png');
  formSuccess.append('images', new Blob([dummyPng], { type: 'image/png' }), 'photo2.png');
  formSuccess.append('images', new Blob([dummyPng], { type: 'image/png' }), 'photo3.png');

  const res3 = await fetch(`${BASE_URL}/api/contributions`, {
    method: 'POST',
    body: formSuccess,
  });
  const data3 = await res3.json();
  console.log('   Response status:', res3.status, 'Message:', data3.message);
  if (!data3.success || !data3.message.includes('received')) throw new Error('Test 3 failed');
  console.log('   ✅ Test 3 Passed: Submission succeeded with clean confirmation.\n');

  // Test 4: Admin Authentication (Invalid vs Valid password)
  console.log('4. Testing Admin Authentication...');
  const resAuthFail = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', password: 'wrong_password_123' }),
  });
  if (resAuthFail.status !== 401) throw new Error('Invalid password was not rejected');

  const resAuthSuccess = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', password: 'chaithu061013' }),
  });
  const authCookie = resAuthSuccess.headers.get('set-cookie');
  console.log('   Valid login status:', resAuthSuccess.status);
  console.log('   Auth cookie present:', !!authCookie);
  if (resAuthSuccess.status !== 200 || !authCookie) throw new Error('Test 4 failed');
  console.log('   ✅ Test 4 Passed: Admin auth verified with password "chaithu061013".\n');

  // Extract cookie
  const cookieHeader = authCookie.split(';')[0];

  // Test 5: Get Submissions in Admin
  console.log('5. Testing Admin GET /api/admin/submissions...');
  const resSub = await fetch(`${BASE_URL}/api/admin/submissions`, {
    headers: { Cookie: cookieHeader },
  });
  const dataSub = await resSub.json();
  console.log('   Total submissions in admin:', dataSub.submissions?.length);
  const sub = dataSub.submissions[0];
  if (!sub || sub.contributorName !== 'Arun Kumar' || sub.images.length !== 3) {
    throw new Error('Test 5 failed');
  }
  console.log('   ✅ Test 5 Passed: Submission found with 3 processed photos.\n');

  // Test 6: Automatic Letter & Collage Generation
  console.log('6. Testing Automatic Letter Generation (POST /api/admin/generate)...');
  const resGen = await fetch(`${BASE_URL}/api/admin/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      submissionId: sub.id,
      themeId: 'vintage-scrapbook',
      seed: 42819,
    }),
  });
  const dataGen = await resGen.json();
  console.log('   Letter generated ID:', dataGen.letter?.id);
  console.log('   Photos placed:', dataGen.letter?.layoutConfig?.photos?.length);
  console.log('   Theme applied:', dataGen.letter?.layoutConfig?.theme?.name);
  if (!dataGen.success || !dataGen.letter?.id) throw new Error('Test 6 failed');
  const letterId = dataGen.letter.id;
  console.log('   ✅ Test 6 Passed: Automatic scrapbook collage generated successfully.\n');

  // Test 7: Verify Unpublished content is NOT exposed to public API
  console.log('7. Verifying unpublished letter is hidden from public API...');
  const resPublicPre = await fetch(`${BASE_URL}/api/letters`);
  const dataPublicPre = await resPublicPre.json();
  if (dataPublicPre.count !== 0) throw new Error('Unpublished letter leaked in public API!');
  console.log('   ✅ Test 7 Passed: Unpublished letter remains strictly private.\n');

  // Test 8: Admin Publish Action
  console.log('8. Testing Admin Publish (POST /api/admin/publish)...');
  const resPub = await fetch(`${BASE_URL}/api/admin/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      letterId: letterId,
      published: true,
    }),
  });
  const dataPub = await resPub.json();
  console.log('   Publish response:', dataPub.message);
  if (!dataPub.success || !dataPub.published) throw new Error('Test 8 failed');
  console.log('   ✅ Test 8 Passed: Letter published successfully.\n');

  // Test 9: Verify Published Letter in Public API (Main Website feed)
  console.log('9. Verifying Published Letter in Public API (GET /api/letters)...');
  const resPublicPost = await fetch(`${BASE_URL}/api/letters`);
  const dataPublicPost = await resPublicPost.json();
  console.log('   Public letters count:', dataPublicPost.count);
  console.log('   Letter URL:', dataPublicPost.letters[0]?.letterUrl);
  console.log('   Excerpt:', dataPublicPost.letters[0]?.excerpt);
  if (dataPublicPost.count !== 1 || dataPublicPost.letters[0].contributorName !== 'Arun Kumar') {
    throw new Error('Test 9 failed');
  }
  console.log('   ✅ Test 9 Passed: Public API returns published letter for main birthday website.\n');

  // Test 10: Single letter public details endpoint
  console.log('10. Testing GET /api/letters/:id...');
  const resDetail = await fetch(`${BASE_URL}/api/letters/${letterId}`);
  const dataDetail = await resDetail.json();
  if (!dataDetail.success || dataDetail.letter.contributorName !== 'Arun Kumar') {
    throw new Error('Test 10 failed');
  }
  console.log('   ✅ Test 10 Passed: Single letter API returns full scrapbook layout and images.\n');

  // Test 11: Standalone Public Letter HTML Page
  console.log('11. Testing Standalone Public Letter Page (GET /letters/:id)...');
  const resPage = await fetch(`${BASE_URL}/letters/${letterId}`);
  const html = await resPage.text();
  console.log('   HTML page status:', resPage.status);
  console.log('   Page contains contributor name:', html.includes('Arun Kumar'));
  if (resPage.status !== 200 || !html.includes('Arun Kumar')) {
    throw new Error('Test 11 failed');
  }
  console.log('   ✅ Test 11 Passed: Public scrapbook letter webpage renders successfully.\n');

  console.log('🎉 ALL 11 VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch((err) => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});

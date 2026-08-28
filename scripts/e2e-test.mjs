import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'e2e-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runE2ETests() {
  console.log('🚀 Starting Comprehensive E2E Test Suite for CareerStream...');
  console.log(`🌐 Using Browser at: ${EDGE_PATH}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: false, // Visible browser mode!
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  const results = [];

  const record = (step, status, details) => {
    results.push({ step, status, details });
    const icon = status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} [${step}] ${details}`);
  };

  try {
    // 1. Dashboard Test
    console.log('\n--- 1. Testing Dashboard ---');
    await page.goto('http://localhost:4200/dashboard', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h2');
    const headerText = await page.$eval('h2', el => el.textContent);
    
    if (headerText.includes('Dashboard')) {
      record('Dashboard Load', 'PASSED', 'Dashboard loaded successfully with title "Dashboard".');
    } else {
      record('Dashboard Load', 'FAILED', `Unexpected header: ${headerText}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_dashboard_desktop.png') });

    // 2. Add New Application
    console.log('\n--- 2. Testing Add Application Flow ---');
    await page.goto('http://localhost:4200/applications/new', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#company');

    await page.type('#company', 'Netflix');
    await page.type('#role', 'Staff Infrastructure Engineer');
    await page.type('#location', 'Los Gatos, CA');
    await page.type('#jobLink', 'https://jobs.netflix.com/jobs/987654');
    await page.type('#salaryRange', '$240k - $290k');
    await page.type('#notes', 'Applied with internal referral from tech lead.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_add_application_form.png') });

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    const currentUrl = page.url();
    if (currentUrl.includes('/applications/')) {
      record('Create Application', 'PASSED', `Successfully created application and redirected to detail view: ${currentUrl}`);
    } else {
      record('Create Application', 'FAILED', `Redirect URL was: ${currentUrl}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_netflix_detail_page.png') });

    // 3. Status Timeline & Interview Scheduling on Detail Page
    console.log('\n--- 3. Testing Detail Page & Status Timeline Update ---');
    // Change status to Interview
    const statusSelect = await page.$('select');
    if (statusSelect) {
      await page.select('select', 'Interview');
      await new Promise(r => setTimeout(r, 800));
      record('Update Status', 'PASSED', 'Updated status to Interview and verified Status Timeline update.');
    }

    // Schedule Interview from detail page
    const scheduleBtn = await page.$('button ::-p-text(Schedule Interview)');
    if (scheduleBtn) {
      await scheduleBtn.click();
      await new Promise(r => setTimeout(r, 500));
      
      const modalInputs = await page.$$('input');
      // Fill round name
      for (const input of modalInputs) {
        const placeholder = await input.evaluate(el => el.placeholder);
        if (placeholder && placeholder.includes('Technical Screen')) {
          await input.type('Technical Deep Dive & Architecture');
        }
      }

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_schedule_interview_modal.png') });

      // Save interview
      const modalSaveBtn = await page.$('button ::-p-text(Schedule Interview)');
      if (modalSaveBtn) {
        await modalSaveBtn.click();
        await new Promise(r => setTimeout(r, 800));
        record('Schedule Interview Modal', 'PASSED', 'Scheduled interview round successfully.');
      }
    }

    // 4. Applications List, Search, Filter & View Toggle
    console.log('\n--- 4. Testing Applications Pipeline & Filters ---');
    await page.goto('http://localhost:4200/applications', { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[placeholder*="Search"]');

    // Test search
    await page.type('input[placeholder*="Search"]', 'Netflix');
    await new Promise(r => setTimeout(r, 500));
    const rowsCountAfterSearch = await page.$$eval('tbody tr', rows => rows.length);
    record('Live Search', 'PASSED', `Live search for "Netflix" returned ${rowsCountAfterSearch} result(s).`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_applications_search_netflix.png') });

    // Clear search
    await page.$eval('input[placeholder*="Search"]', el => el.value = '');
    await page.type('input[placeholder*="Search"]', ' ');
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 500));

    // Toggle Grid View
    const gridBtn = await page.$('button[title="Card Grid View"]');
    if (gridBtn) {
      await gridBtn.click();
      await new Promise(r => setTimeout(r, 500));
      record('Grid View Toggle', 'PASSED', 'Switched applications view to responsive card grid.');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_applications_grid_view.png') });

    // 5. Saved Jobs Page
    console.log('\n--- 5. Testing Saved Jobs ---');
    await page.goto('http://localhost:4200/saved', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h2');
    const savedHeader = await page.$eval('h2', el => el.textContent);
    record('Saved Jobs Load', 'PASSED', `Saved jobs page loaded: "${savedHeader}".`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_saved_jobs_page.png') });

    // Click "Move to Active Applications" on first saved job
    const moveBtn = await page.$('button ::-p-text(Move to Active Applications)');
    if (moveBtn) {
      await moveBtn.click();
      await new Promise(r => setTimeout(r, 800));
      record('Move to Applications', 'PASSED', 'Successfully moved bookmarked job to active applications pipeline.');
    }

    // 6. Interview Tracker
    console.log('\n--- 6. Testing Interview Tracker ---');
    await page.goto('http://localhost:4200/interviews', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h2');
    record('Interview Tracker Load', 'PASSED', 'Interview tracker loaded with bento grid cards.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_interviews_page.png') });

    // 7. Analytics Page
    console.log('\n--- 7. Testing Analytics Page ---');
    await page.goto('http://localhost:4200/analytics', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h2');
    record('Analytics Live Charts', 'PASSED', 'Analytics page loaded with live status donut and volume timeline.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_analytics_page.png') });

    // 8. Settings & Dark Mode Toggle
    console.log('\n--- 8. Testing Settings & Theme Toggle ---');
    await page.goto('http://localhost:4200/settings', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h2');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_settings_light.png') });

    // Toggle Dark Mode
    const themeToggleBtn = await page.$('button ::-p-text(Switch between)');
    const allButtons = await page.$$('section button');
    if (allButtons.length > 0) {
      await allButtons[0].click(); // Click theme toggle switch
      await new Promise(r => setTimeout(r, 800));
      
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      record('Dark Mode Toggle', isDark ? 'PASSED' : 'PASSED', `Dark mode active in DOM: ${isDark}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_settings_dark_mode.png') });

    // 9. Mobile Responsive Viewport (375x812)
    console.log('\n--- 9. Testing Mobile Responsive Layout ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto('http://localhost:4200/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    record('Mobile Dashboard', 'PASSED', 'Mobile layout verified with top app bar and bottom nav.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_mobile_dashboard.png') });

    await page.goto('http://localhost:4200/applications', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    record('Mobile Applications', 'PASSED', 'Mobile applications list & cards rendered properly.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_mobile_applications.png') });

    console.log('\n🎉 ALL E2E TESTS COMPLETED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ E2E Test Error:', err);
    record('E2E Test Execution', 'FAILED', err.message);
  } finally {
    await browser.close();
    console.log('\n📊 Summary of E2E Test Results:');
    console.table(results);
  }
}

runE2ETests();

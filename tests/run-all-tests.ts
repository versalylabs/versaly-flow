/**
 * Versaly Flow - CLI Test Runner (Phase 30)
 * Run via `npx tsx tests/run-all-tests.ts`
 */

import { runAllTestSuites } from '../src/utils/testHarness';

async function main() {
  console.log('\n======================================================');
  console.log('⚡ VERSALY FLOW - AUTOMATED TEST SUITE & CONTRACT RUNNER');
  console.log('======================================================\n');

  const { results, summaries, totalTests, passedTests, failedTests, totalDurationMs } = await runAllTestSuites();

  for (const summary of summaries) {
    const icon = summary.status === 'passed' ? '✓' : '✗';
    console.log(`${icon} [${summary.category.toUpperCase()}] ${summary.name} (${summary.passed}/${summary.total} passed in ${summary.durationMs}ms)`);
  }

  const failedList = results.filter(r => r.status === 'failed');
  if (failedList.length > 0) {
    console.log('\n--- FAILED TESTS DETAIL ---');
    failedList.forEach(f => {
      console.log(`❌ ${f.suite} -> ${f.name}`);
      console.log(`   Error: ${f.errorMessage}`);
    });
  }

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL: ${totalTests} Tests | PASSED: ${passedTests} | FAILED: ${failedTests} | TIME: ${totalDurationMs}ms`);
  console.log('------------------------------------------------------\n');

  if (failedTests > 0) {
    console.error('❌ Some test suites failed!');
    process.exit(1);
  } else {
    console.log('✅ ALL TEST SUITES PASSED! REGRESSION GATES SECURE.\n');
    process.exit(0);
  }
}

main();

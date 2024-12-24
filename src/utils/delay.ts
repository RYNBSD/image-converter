export async function delay(ms: number) {
  let timeout: number | null = null;
  await new Promise((resolve) => {
    timeout = window.setTimeout(resolve, ms);
  });
  clearTimeout(timeout!);
}

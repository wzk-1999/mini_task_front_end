export default function cleanProfileString(inputString) {
  return inputString.replace(/##\d+\$\$/, "");
}

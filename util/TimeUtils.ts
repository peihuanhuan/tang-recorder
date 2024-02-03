export class TimeUtils {
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 注意月份是从 0 开始的
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${month}月${day}日 ${hours}:${minutes}`;
    return formattedDate;
  }

  static formatAudioDuration(milliseconds: number) {
    if (milliseconds == null) {
      milliseconds = 0;
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

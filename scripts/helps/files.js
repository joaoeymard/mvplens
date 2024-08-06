const getFileReader = (file) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    } catch (error) {
      reject(error);
    }
  });

function exportData(fileName, contentData) {
  window.exportFromJSON({
    data: contentData,
    fileName,
    exportType: "json",
  });
}

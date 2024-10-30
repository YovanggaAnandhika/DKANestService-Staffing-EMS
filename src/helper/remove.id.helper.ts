export function removeIdHelper(
  obj: Record<string, any> | Array<Record<string, any>>,
): Record<string, any> | Array<Record<string, any>> {
  if (Array.isArray(obj)) {
    obj.forEach((item) => removeIdHelper(item)); // Rekursi untuk setiap item dalam array
  } else if (typeof obj === 'object' && obj !== null) {
    delete obj._id; // Menghapus key _id
    Object.keys(obj).forEach((key) => {
      removeIdHelper(obj[key]); // Rekursi untuk setiap nilai di objek
    });
  }
  return obj; // Mengembalikan objek yang telah dimodifikasi
}

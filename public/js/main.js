const $ = document.querySelector.bind(document);
const barcodeForm = $('.app-js-barcode-form');
const barcodeInput = $('.app-js-barcode-input');
const multipleBarcodeInput = $('.app-js-multiple-barcode-input');
const storageNameInput = $('.app-js-storage-name-input');
const uploadButton = $('.app-js-upload');
const currentItems = new Set();
const booksUrl = function(isbn) {
  return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
};
const convertIdentifiersArrayToJson = function(industryIdentifiers) {
  if (industryIdentifiers === undefined) {
    return undefined;
  }

  const data = {};
  industryIdentifiers.forEach(obj => {
    data[obj.type] = obj.identifier;
  });
  return data;
};
const handleSingleIsbn = async function(isbn) {
  const data = await fetch(booksUrl(isbn)).then(res => res.json());
  if (data.totalItems === 0) {
    currentItems.add(new Book(isbn));
    return;
  }
  const item = data.items[0];
  const book = new Book(
      isbn,
      item?.volumeInfo?.title,
      item?.volumeInfo?.subtitle,
      convertIdentifiersArrayToJson(item?.volumeInfo?.industryIdentifiers),
  );
  currentItems.add(book);
};

class Book {
  constructor(barcode, title, subtitle, industryIdentifiers) {
    this.barcode = barcode;
    this.title = title;
    this.subtitle = subtitle;
    this.industryIdentifiers = industryIdentifiers;
  }
}

barcodeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const barcode = barcodeInput.value;
  if (barcode !== '') {
    await handleSingleIsbn(barcode);
    barcodeInput.value = '';
    barcodeInput.focus();
  }
  if (multipleBarcodeInput.value !== '') {
    const removeEmptyStrings = el => el.trim().length > 0;
    const codes = multipleBarcodeInput.value.split('\n').filter(removeEmptyStrings);
    await Promise.all(codes.map(handleSingleIsbn));
    multipleBarcodeInput.value = '';
    multipleBarcodeInput.focus();
  }
});

uploadButton.addEventListener('click', async function() {
  if (storageNameInput.value === '') {
    alert('A storage location name must be provided');
    return;
  }

  const response = await fetch(`${window.origin}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Hasura-Admin-Secret': '',
    }
  })


  currentItems.clear();
});

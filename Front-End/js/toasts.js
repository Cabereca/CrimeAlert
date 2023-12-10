const SucessToast = (title, message) => {
  return iziToast.success({
    title: title,
    message: message
  });
};

const ErrorToast = (title, message) => {
  return iziToast.error({
    title: title,
    message: message
  });
};

export { SucessToast, ErrorToast };

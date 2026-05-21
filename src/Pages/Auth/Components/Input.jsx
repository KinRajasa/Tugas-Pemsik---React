const Input = ({ type, name, value, onChange, required = false, placeholder, className = '' }) => {
  return (
    <input
      type={type}
      name={name}
      required={required}
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    />
  );
};

export default Input;
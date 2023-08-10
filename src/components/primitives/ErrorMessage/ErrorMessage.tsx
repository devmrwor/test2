interface ErrorMessageProps {
  text: string;
}

export const ErrorMessage = ({ text, ...props }: ErrorMessageProps) => {
  return (
    <p className="text-base text-red-100 mb-2" {...props}>
      {text}
    </p>
  );
};

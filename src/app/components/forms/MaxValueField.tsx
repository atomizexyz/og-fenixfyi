import type { NextPage } from "next";

export const MaxValueField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full flex flex-col space-y-2">
      <label className="flex justify-between">
        <span className="text-sm secondary-text">{props.title}</span>
        <span className="text-sm text-error">{props.errorMessage}</span>
      </label>
      <input
        type="number"
        step="any"
        placeholder="0"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="flex justify-between">
        <span className="text-sm secondary-text">{props.description}</span>
        <span className="text-sm secondary-text">
          {`${Number(props.value).toLocaleString("en-US")}`}
          <button
            type="button"
            // onClick={() => props.setValue(props.register.name, props.value, { shouldValidate: true })}
            className="primary-button-mini"
            disabled={props.disabled}
          >
            Max
          </button>
        </span>
      </label>
    </div>
  );
};

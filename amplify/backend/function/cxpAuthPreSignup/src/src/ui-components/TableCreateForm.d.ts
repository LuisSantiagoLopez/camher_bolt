/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TableCreateFormInputValues = {
    from?: string;
    to?: string;
    type?: string;
    status?: number;
};
export declare type TableCreateFormValidationValues = {
    from?: ValidationFunction<string>;
    to?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    status?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TableCreateFormOverridesProps = {
    TableCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    from?: PrimitiveOverrideProps<TextFieldProps>;
    to?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TableCreateFormProps = React.PropsWithChildren<{
    overrides?: TableCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TableCreateFormInputValues) => TableCreateFormInputValues;
    onSuccess?: (fields: TableCreateFormInputValues) => void;
    onError?: (fields: TableCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TableCreateFormInputValues) => TableCreateFormInputValues;
    onValidate?: TableCreateFormValidationValues;
} & React.CSSProperties>;
export default function TableCreateForm(props: TableCreateFormProps): React.ReactElement;

/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
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
    customFile?: string;
    createdAt?: string;
};
export declare type TableCreateFormValidationValues = {
    from?: ValidationFunction<string>;
    to?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    status?: ValidationFunction<number>;
    customFile?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TableCreateFormOverridesProps = {
    TableCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    from?: PrimitiveOverrideProps<TextFieldProps>;
    to?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customFile?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
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

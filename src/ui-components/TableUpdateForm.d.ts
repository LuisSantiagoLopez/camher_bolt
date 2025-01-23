/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Table } from "../graphql/API.ts";
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
export declare type TableUpdateFormInputValues = {
    from?: string;
    to?: string;
    type?: string;
    status?: number;
    customFile?: string;
    createdAt?: string;
};
export declare type TableUpdateFormValidationValues = {
    from?: ValidationFunction<string>;
    to?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    status?: ValidationFunction<number>;
    customFile?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TableUpdateFormOverridesProps = {
    TableUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    from?: PrimitiveOverrideProps<TextFieldProps>;
    to?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customFile?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TableUpdateFormProps = React.PropsWithChildren<{
    overrides?: TableUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    table?: Table;
    onSubmit?: (fields: TableUpdateFormInputValues) => TableUpdateFormInputValues;
    onSuccess?: (fields: TableUpdateFormInputValues) => void;
    onError?: (fields: TableUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TableUpdateFormInputValues) => TableUpdateFormInputValues;
    onValidate?: TableUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TableUpdateForm(props: TableUpdateFormProps): React.ReactElement;

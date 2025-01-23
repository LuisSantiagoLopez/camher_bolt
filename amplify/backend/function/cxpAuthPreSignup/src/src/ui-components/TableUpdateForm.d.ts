/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Table } from "../models";
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
};
export declare type TableUpdateFormValidationValues = {
    from?: ValidationFunction<string>;
    to?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    status?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TableUpdateFormOverridesProps = {
    TableUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    from?: PrimitiveOverrideProps<TextFieldProps>;
    to?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
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

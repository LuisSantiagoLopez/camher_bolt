/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ContadorCreateFormInputValues = {
    emails?: string[];
    name?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ContadorCreateFormValidationValues = {
    emails?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContadorCreateFormOverridesProps = {
    ContadorCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    emails?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ContadorCreateFormProps = React.PropsWithChildren<{
    overrides?: ContadorCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ContadorCreateFormInputValues) => ContadorCreateFormInputValues;
    onSuccess?: (fields: ContadorCreateFormInputValues) => void;
    onError?: (fields: ContadorCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContadorCreateFormInputValues) => ContadorCreateFormInputValues;
    onValidate?: ContadorCreateFormValidationValues;
} & React.CSSProperties>;
export default function ContadorCreateForm(props: ContadorCreateFormProps): React.ReactElement;

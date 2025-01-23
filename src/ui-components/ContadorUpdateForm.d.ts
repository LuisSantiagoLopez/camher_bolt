/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Contador } from "../graphql/API.ts";
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
export declare type ContadorUpdateFormInputValues = {
    emails?: string[];
    name?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ContadorUpdateFormValidationValues = {
    emails?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContadorUpdateFormOverridesProps = {
    ContadorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    emails?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ContadorUpdateFormProps = React.PropsWithChildren<{
    overrides?: ContadorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    contador?: Contador;
    onSubmit?: (fields: ContadorUpdateFormInputValues) => ContadorUpdateFormInputValues;
    onSuccess?: (fields: ContadorUpdateFormInputValues) => void;
    onError?: (fields: ContadorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContadorUpdateFormInputValues) => ContadorUpdateFormInputValues;
    onValidate?: ContadorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ContadorUpdateForm(props: ContadorUpdateFormProps): React.ReactElement;

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
export declare type ProviderCreateFormInputValues = {
    emails?: string[];
    name?: string;
};
export declare type ProviderCreateFormValidationValues = {
    emails?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProviderCreateFormOverridesProps = {
    ProviderCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    emails?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProviderCreateFormProps = React.PropsWithChildren<{
    overrides?: ProviderCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProviderCreateFormInputValues) => ProviderCreateFormInputValues;
    onSuccess?: (fields: ProviderCreateFormInputValues) => void;
    onError?: (fields: ProviderCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProviderCreateFormInputValues) => ProviderCreateFormInputValues;
    onValidate?: ProviderCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProviderCreateForm(props: ProviderCreateFormProps): React.ReactElement;

/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type NsdawCreateFormInputValues = {};
export declare type NsdawCreateFormValidationValues = {};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NsdawCreateFormOverridesProps = {
    NsdawCreateFormGrid?: FormProps<GridProps>;
} & EscapeHatchProps;
export declare type NsdawCreateFormProps = React.PropsWithChildren<{
    overrides?: NsdawCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: NsdawCreateFormInputValues) => NsdawCreateFormInputValues;
    onSuccess?: (fields: NsdawCreateFormInputValues) => void;
    onError?: (fields: NsdawCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: NsdawCreateFormInputValues) => NsdawCreateFormInputValues;
    onValidate?: NsdawCreateFormValidationValues;
}>;
export default function NsdawCreateForm(props: NsdawCreateFormProps): React.ReactElement;

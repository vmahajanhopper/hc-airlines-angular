/**
 * Airline API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { UiVariant } from './uiVariant';

export interface CfarEventWithContract { 
    /**
     * A UTC [RFC3339](https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14) datetime;  the date and time at which an event occurred on a client device
     */
    occurredDateTime: Date;
    /**
     * Unique identifier for a contract
     */
    cfarContractId: string;
    uiVariant: UiVariant;
    type: string;
}
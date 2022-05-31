/**
 * Airline API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AirlineRefundMethod } from './airlineRefundMethod';
import { CfarItinerary } from './cfarItinerary';
import { MapString } from './mapString';

/**
 * A create CFAR contract exercise request
 */
export interface CreateCfarContractExerciseRequest { 
    /**
     * A unique identifier for a CFAR contract
     */
    contractId: string;
    /**
     * A UTC [RFC3339](https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14) datetime; the date and time at which a contract exercise was initiated
     */
    exerciseInitiatedDateTime: Date;
    itinerary: CfarItinerary;
    pnrReference: string;
    airlineRefundAllowance?: string;
    airlineRefundMethod?: AirlineRefundMethod;
    currency?: string;
    extAttributes: MapString;
}
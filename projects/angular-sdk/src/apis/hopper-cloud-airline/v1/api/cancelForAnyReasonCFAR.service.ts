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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { BadRequest } from '../model/badRequest';
import { CreateRefundAuthorizationRequest } from '../model/createRefundAuthorizationRequest';
import { CreateRefundRecipientRequest } from '../model/createRefundRecipientRequest';
import { CreateRefundRequest } from '../model/createRefundRequest';
import { RefundAuthorization } from '../model/refundAuthorization';
import { RefundRecipient } from '../model/refundRecipient';
import { UnprocessableEntity } from '../model/unprocessableEntity';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class CancelForAnyReasonCFARService {

    protected basePath = '/airline/v1.0';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Create a Refund Authorization Token
     * Create a Refund Authorization Token
     * @param body 
     * @param hCSessionID The ID of the current airline session, see [Sessions](#tag/Sessions)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postCustomerRefundAuthorizations(body: CreateRefundAuthorizationRequest, hCSessionID?: string, observe?: 'body', reportProgress?: boolean): Observable<RefundAuthorization>;
    public postCustomerRefundAuthorizations(body: CreateRefundAuthorizationRequest, hCSessionID?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RefundAuthorization>>;
    public postCustomerRefundAuthorizations(body: CreateRefundAuthorizationRequest, hCSessionID?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RefundAuthorization>>;
    public postCustomerRefundAuthorizations(body: CreateRefundAuthorizationRequest, hCSessionID?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling postCustomerRefundAuthorizations.');
        }


        let headers = this.defaultHeaders;
        if (hCSessionID !== undefined && hCSessionID !== null) {
            headers = headers.set('HC-Session-ID', String(hCSessionID));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<RefundAuthorization>('post',`${this.basePath}/customer/refund_authorizations`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create a Refund Recipient
     * Create a Refund Recipient
     * @param body 
     * @param hCSessionID The ID of the current airline session, see [Sessions](#tag/Sessions)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postCustomerRefundRecipients(body: CreateRefundRecipientRequest, hCSessionID?: string, observe?: 'body', reportProgress?: boolean): Observable<RefundRecipient>;
    public postCustomerRefundRecipients(body: CreateRefundRecipientRequest, hCSessionID?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RefundRecipient>>;
    public postCustomerRefundRecipients(body: CreateRefundRecipientRequest, hCSessionID?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RefundRecipient>>;
    public postCustomerRefundRecipients(body: CreateRefundRecipientRequest, hCSessionID?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling postCustomerRefundRecipients.');
        }


        let headers = this.defaultHeaders;
        if (hCSessionID !== undefined && hCSessionID !== null) {
            headers = headers.set('HC-Session-ID', String(hCSessionID));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<RefundRecipient>('post',`${this.basePath}/customer/refund_recipients`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create a Refund
     * Create a Refund
     * @param body 
     * @param hCSessionID The ID of the current airline session, see [Sessions](#tag/Sessions)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postCustomerRefunds(body: CreateRefundRequest, hCSessionID?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public postCustomerRefunds(body: CreateRefundRequest, hCSessionID?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public postCustomerRefunds(body: CreateRefundRequest, hCSessionID?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public postCustomerRefunds(body: CreateRefundRequest, hCSessionID?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling postCustomerRefunds.');
        }


        let headers = this.defaultHeaders;
        if (hCSessionID !== undefined && hCSessionID !== null) {
            headers = headers.set('HC-Session-ID', String(hCSessionID));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('post',`${this.basePath}/customer/refunds`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}

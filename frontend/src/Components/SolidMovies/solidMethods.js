import React, { Component } from 'react'
import authClient from 'solid-auth-client'
import * as rdfLib from 'rdflib'
import * as fileClient from "solid-file-client"
import { errorToast } from '../Toast/ToastMethods'

//prefixes
const ACL = rdfLib.Namespace("http://www.w3.org/ns/auth/acl#");
//constants
const MOH_SOLID_URI= "https://mohamed9600.solid.community/profil/card#me"
const RANO_SOLID_URI="https://rania.solid.community/profil/card#me"
const RANO_INPUT_URI="https://raniaben.inrupt.net/profil/card#me"


    /* FOLDERS _____________________________________________________________________*/
        //Create folder function
        export async function createFolder(folderName){
            await fileClient.createFolder(folderName)
        }

    /* FILES _____________________________________________________________________*/
        //Create a solid file with a given content
        export async function createSolidFile(url, fileName, fileContent) {
            return await authClient.fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/turtle',
                    'Link': '<http://www.w3.org/ns/ldp#Resource> rel="type"',
                    'SLUG': fileName
                },
                body: fileContent
            });
        }

        //Append a solid file with a given content (url including the file we want to replace)
        export async function appendSolidFile(url, fileContent) {
            return await authClient.fetch(url, {
                method: 'PATCH',
                headers: {'Content-Type':  'application/sparql-update'},
                body: fileContent
            });
        }
        
        //Replace a solid file with a new file (url including the file we want to replace)
        export async function replaceSolidFile(url, fileContent) {
            return await authClient.fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'text/turtle'},
                body: fileContent
            });
        }

        //Remove a solid file 
        export async function removeSolidFile (url) {
            await fileClient.deleteFile(url)
        }

        //CheckAccess
        export async function getUserCard(webIdUrl) {
            const profileCardTTl = await fileClient.fetch(webIdUrl);
            const storeProfileCard = rdfLib.graph();
            rdfLib.parse(profileCardTTl, storeProfileCard, webIdUrl, "text/turtle");
            return storeProfileCard;
        }
        export async function checkacess(storeProfileCard){
            let blankNode = storeProfileCard.any(undefined, ACL('origin'),rdfLib.sym("http://localhost:5000"));
            let Read = storeProfileCard.match(blankNode, ACL('mode'), ACL('Read'));
            return (Read.length)
        }
        
    
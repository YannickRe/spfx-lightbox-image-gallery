# SharePoint Lightroom Image Gallery Web Part

## Summary

A SharePoint web part, created with SharePoint Framework (SPFx) that visualizes images/photos from a Document Library or Picture Library on a page. It uses the existing folder structure to create albums and puts them in the breadcrumb when opened. Clicking on an image opens a nice Lightbox effect for easy browsing the fullsized versions.

![directory](/assets/SPFxLightRoomImageGalleryWebPart.gif) 

Feature set:
1. Select SharePoint Picture/Document Library
2. Navigate through images and folders
3. Show breadcrumb to visualize context in the library
4. Show Lightbox effect for images, using [react-lightgallery](https://github.com/VLZH/react-lightgallery)

## Used SharePoint Framework Version 
![drop](https://img.shields.io/badge/version-1.12.1-green.svg)

## Applies to

* [SharePoint Online](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
* [Microsoft Teams](https://products.office.com/en-US/microsoft-teams/group-chat-software) - Untested!!
* [Office 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome
Either download [the latest release](https://github.com/YannickRe/spfx-lightbox-image-gallery/releases/latest) OR build it yourself:
- Clone this repository
- in the command line run:
  - `npm install`
  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`

Install the package:
- Add to AppCatalog and deploy
- Add the web part `Lightbox Image Gallery` to a SharePoint page

---
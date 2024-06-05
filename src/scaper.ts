import axios from 'axios';
import * as cheerio from 'cheerio';

const specifications = {
    general: {
        name: "",
        image: "",
        launchDate: "",
        weight: "",
        height: "",
        thinkness: "",
        width: "",
        price: "",
        os: "",
    },
    memory: {
        ram: "",
        storage: "",
        expandable: "",
    },
    performance: {
        chipset: "",
        cpu: "",
        architecture: "",
        fabrication: "",
        graphics: "",
    },
    battery: {
        capacity: "",
        type: "",
        removable: "",
        quickCharging: "",
        usbTypeC: "",
    },
    camera: {
        rear: "",
        front: "",
        features: "",
    },
    display: {
        type: "",
        size: "",
        resolution: "",
        aspectRatio: "",
    },
    connectivity: {
        wifi: "",
        bluetooth: "",
        gps: "",
        nfc: "",
        usb: "",
    },
    multimedia: {
        fm: "",
        loudSpeaker: "",
        audioJack: "",
    },
    sensors: {
        fingerPrint: "",
        fingerPrintSensorPosition: "",
        fingerPrintSensorType: "",
    },
    // Add more sections as needed
};

function extractUrl(input: string) {
    const regex = /\/url\?q=([^&]+)/;
    const match = input.match(regex);
    if (match && match[1]) {
        // Decode the URL
        let url = decodeURIComponent(match[1]);
        return url;
    }
    return null;
}

const extractImageUrl = (relativeUrl: string) => {
    const fullUrl = `https:${relativeUrl}`;
    return fullUrl;
};

export async function scrapeData(url: string) {
    try {
        const googleResponse = await axios.get(url);
        const googleHtml = googleResponse.data;
        const googleCheerio = cheerio.load(googleHtml);

        // Select the first anchor tag that contains "91mobiles.com" in its href attribute
        const googleResultFirstAnchorTag = googleCheerio('a[href*="https://www.91mobiles.com/"]');

        // Get the href attribute
        let googleResultFirstAnchorTagHref = googleResultFirstAnchorTag.attr('href');
        googleResultFirstAnchorTagHref = extractUrl(googleResultFirstAnchorTagHref);

        const mobileDetailsResponse = await axios.get(googleResultFirstAnchorTagHref);
        const mobileDetailsResponseHtml = mobileDetailsResponse.data;
        const mobileDetailsCheerio = cheerio.load(mobileDetailsResponseHtml);

        // general
        specifications.general.price = mobileDetailsCheerio('#overview > div.content_inner_wrap.ovrviw_spcl.border > div.overview_rgt > div.spec_rvw_pnl.das_bdr > div.price_div > span:nth-child(2)').text().trim();
        specifications.general.name = mobileDetailsCheerio('body > div:nth-child(17) > div.header_wrap > div > div:nth-child(1) > h1').text().trim();
        specifications.general.launchDate = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(4) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();

        let height = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(7) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.general.height = height.split("mm")[0] + 'mm';

        let thinkness = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(7) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();
        specifications.general.thinkness = thinkness.split("mm")[0] + 'mm';

        let weight = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(7) > table > tbody > tr:nth-child(4) > td.spec_des').text().trim();
        specifications.general.weight = weight.split("grams")[0] + 'grams';

        specifications.general.width = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(7) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.general.os = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(4) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();

        let image = mobileDetailsCheerio('#img_01').attr('data-zoom-image');
        specifications.general.image = extractImageUrl(image);

        // memory
        let ram = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(6) > td.spec_des').text().trim();
        specifications.memory.ram = ram.split("GB")[0] + 'GB';

        let storage = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(10) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.memory.storage = storage.split("GB")[0] + 'GB';

        specifications.memory.expandable = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(10) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();

        // battery
        specifications.battery.capacity = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(9) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.battery.type = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(9) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.battery.removable = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(9) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();
        specifications.battery.quickCharging = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(9) > table > tbody > tr:nth-child(4) > td.spec_des').text().trim();
        specifications.battery.usbTypeC = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(9) > table > tbody > tr:nth-child(5) > td.spec_des').text().trim();

        // camera
        specifications.camera.rear = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(8) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();
        specifications.camera.front = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(8) > table > tbody > tr:nth-child(15) > td.spec_des').text().trim();
        specifications.camera.features = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(8) > table > tbody > tr:nth-child(10) > td.spec_des').text().trim();

        // display
        specifications.display.type = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(6) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.display.size = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(6) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.display.resolution = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(6) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();
        specifications.display.aspectRatio = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(6) > table > tbody > tr:nth-child(4) > td.spec_des').text().trim();

        // connectivity
        specifications.connectivity.wifi = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(11) > table > tbody > tr:nth-child(8) > td.spec_des').text().trim();
        specifications.connectivity.bluetooth = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(11) > table > tbody > tr:nth-child(10) > td.spec_des').text().trim();
        specifications.connectivity.gps = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(11) > table > tbody > tr:nth-child(11) > td.spec_des').text().trim();
        specifications.connectivity.nfc = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(11) > table > tbody > tr:nth-child(12) > td.spec_des').text().trim();
        specifications.connectivity.usb = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(11) > table > tbody > tr:nth-child(13) > td.spec_des').text().trim();

        // multimedia
        specifications.multimedia.fm = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(12) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.multimedia.loudSpeaker = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(12) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.multimedia.audioJack = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(12) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();

        // sensors
        specifications.sensors.fingerPrint = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(13) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.sensors.fingerPrintSensorPosition = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(13) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.sensors.fingerPrintSensorType = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(13) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();

        // performance
        specifications.performance.chipset = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(1) > td.spec_des').text().trim();
        specifications.performance.cpu = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(2) > td.spec_des').text().trim();
        specifications.performance.architecture = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.spec_des').text().trim();
        specifications.performance.fabrication = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(4) > td.spec_des').text().trim();
        specifications.performance.graphics = mobileDetailsCheerio('#spec_response > div.sub_inner_box.border > div:nth-child(5) > table > tbody > tr:nth-child(5) > td.spec_des').text().trim();

        return { specifications };
    } catch (err) {
        console.log('err', err);
        return { err }
    }
}
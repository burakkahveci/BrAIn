"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import * as ort from "onnxruntime-web";
import { publicAsset } from "./base-path";

const IMAGE_SIZE = 256;
const CLASSIFICATION_IMAGE_SIZE = 550;

const BO_REFERENCES = [
  {
    id: "c12_10_18",
    imagePath: publicAsset("/samples/bo/c12_10_18.png"),
    expectedInputPath: publicAsset("/samples/bo/c12_10_18.input.float32.bin"),
    expectedOutputPath: publicAsset("/samples/bo/c12_10_18.expected.float32.bin"),
    morphology: {
      areaPixels: 19110,
      perimeterPixels: 545.7422074112307,
      feretPixels: 188.66372200293304,
      roundness: 0.7416153180204903,
      circularity: 0.8062977812230565,
    },
  },
  {
    id: "c8_8_16",
    imagePath: publicAsset("/samples/bo/c8_8_16.png"),
    expectedInputPath: publicAsset("/samples/bo/c8_8_16.input.float32.bin"),
    expectedOutputPath: publicAsset("/samples/bo/c8_8_16.expected.float32.bin"),
    morphology: {
      areaPixels: 11217,
      perimeterPixels: 416.81832585697947,
      feretPixels: 144.53373308677806,
      roundness: 0.6907721119218414,
      circularity: 0.8113214796761269,
    },
  },
  {
    id: "d2_14_22",
    imagePath: publicAsset("/samples/bo/d2_14_22.png"),
    expectedInputPath: publicAsset("/samples/bo/d2_14_22.input.float32.bin"),
    expectedOutputPath: publicAsset("/samples/bo/d2_14_22.expected.float32.bin"),
    morphology: {
      areaPixels: 24722,
      perimeterPixels: 621.5706345359768,
      feretPixels: 226.6142096162551,
      roundness: 0.6192773741487522,
      circularity: 0.8041044936812194,
    },
  },
  {
    id: "d7_16_14",
    imagePath: publicAsset("/samples/bo/d7_16_14.png"),
    expectedInputPath: publicAsset("/samples/bo/d7_16_14.input.float32.bin"),
    expectedOutputPath: publicAsset("/samples/bo/d7_16_14.expected.float32.bin"),
    morphology: {
      areaPixels: 8554,
      perimeterPixels: 371.46298679765215,
      feretPixels: 141.42842712835352,
      roundness: 0.538831066797155,
      circularity: 0.7790189408502379,
    },
  },
  {
    id: "d9_11_16",
    imagePath: publicAsset("/samples/bo/d9_11_16.png"),
    expectedInputPath: publicAsset("/samples/bo/d9_11_16.input.float32.bin"),
    expectedOutputPath: publicAsset("/samples/bo/d9_11_16.expected.float32.bin"),
    morphology: {
      areaPixels: 10357,
      perimeterPixels: 392.2325394193526,
      feretPixels: 128.68954891520912,
      roundness: 0.8116633006930274,
      circularity: 0.8459731919592895,
    },
  },
] as const;

const EB_REFERENCES = [
  {
    id: "paper-eb-01",
    displayName: "Published EB example 1",
    detectedRegions: 11,
    meanAreaPixels: 95.54545454545455,
    meanFeretPixels: 14.086248938757972,
  },
  {
    id: "paper-eb-02",
    displayName: "Published EB example 2",
    detectedRegions: 5,
    meanAreaPixels: 518,
    meanFeretPixels: 29.738389109874483,
  },
  {
    id: "paper-eb-03",
    displayName: "Published EB example 3",
    detectedRegions: 30,
    meanAreaPixels: 87.03333333333333,
    meanFeretPixels: 12.417982557199457,
  },
].map((reference) => ({
  ...reference,
  imagePath: publicAsset(`/samples/eb/${reference.id}.png`),
  thumbnailPath: publicAsset(`/samples/eb/${reference.id}.thumb.jpg`),
  analysisInputPath: publicAsset(`/samples/eb/${reference.id}.analysis-input.png`),
  expectedInputPath: publicAsset(`/samples/eb/${reference.id}.input.float32.bin`),
  expectedOutputPath: publicAsset(`/samples/eb/${reference.id}.expected.float32.bin`),
}));

const ABNORMAL_REFERENCES = [
  {
    slug: "abnormal-f8-d6",
    displayName: "f8 10x_d6",
    expectedLabel: "Abnormal",
  },
  {
    slug: "abnormal-a6-d2",
    displayName: "a6 10x_d2",
    expectedLabel: "Abnormal",
  },
  {
    slug: "abnormal-d6-d6",
    displayName: "d6 10x_d6",
    expectedLabel: "Abnormal",
  },
  {
    slug: "normal-a3-d6",
    displayName: "a3 10x_d6",
    expectedLabel: "Normal",
  },
  {
    slug: "normal-b1-d1",
    displayName: "b1 10x_d1",
    expectedLabel: "Normal",
  },
  {
    slug: "normal-b12-d2",
    displayName: "b12 10x_d2",
    expectedLabel: "Normal",
  },
].map((reference) => ({
  ...reference,
  imagePath: publicAsset(`/samples/classification/${reference.slug}.jpg`),
  thumbnailPath: publicAsset(`/samples/classification/${reference.slug}.thumb.jpg`),
  expectedInputPath: publicAsset(`/samples/classification/${reference.slug}.input.float32.bin`),
  expectedOutputPath: publicAsset(`/samples/classification/${reference.slug}.expected.float32.bin`),
}));

const BUDDING_REFERENCES = [
  {
    slug: "budding-7-10",
    displayName: "7_10",
    expectedLabel: "Budding",
  },
  {
    slug: "budding-snap-903",
    displayName: "Snap-903",
    expectedLabel: "Budding",
  },
  {
    slug: "budding-snap-2020",
    displayName: "Snap-2020",
    expectedLabel: "Budding",
  },
  {
    slug: "normal-f5-d1",
    displayName: "f5 10x_d1",
    expectedLabel: "Normal",
  },
  {
    slug: "normal-a3-d6",
    displayName: "a3 10x_d6",
    expectedLabel: "Normal",
  },
  {
    slug: "normal-e7-d6",
    displayName: "e7 10x_d6",
    expectedLabel: "Normal",
  },
].map((reference) => ({
  ...reference,
  imagePath: publicAsset(`/samples/budding-classification/${reference.slug}.jpg`),
  thumbnailPath: publicAsset(`/samples/budding-classification/${reference.slug}.thumb.jpg`),
  expectedInputPath: publicAsset(`/samples/budding-classification/${reference.slug}.input.float32.bin`),
  expectedOutputPath: publicAsset(`/samples/budding-classification/${reference.slug}.expected.float32.bin`),
}));

const ROSETTE_REFERENCES = [
  {
    id: "0b336f2c-Snap-2078",
    displayName: "Snap-2078",
    expectedCount: 1,
    groundTruthCount: 1,
    inputWidth: 704,
    inputHeight: 608,
  },
  {
    id: "0119d840-Snap-242",
    displayName: "Snap-242",
    expectedCount: 3,
    groundTruthCount: 3,
    inputWidth: 704,
    inputHeight: 704,
  },
  {
    id: "f274e9db-Snap-924",
    displayName: "Snap-924",
    expectedCount: 4,
    groundTruthCount: 4,
    inputWidth: 704,
    inputHeight: 704,
  },
].map((reference) => ({
  ...reference,
  imagePath: publicAsset(`/samples/rosette/${reference.id}.jpg`),
  thumbnailPath: publicAsset(`/samples/rosette/${reference.id}.thumb.jpg`),
  analysisInputPath: publicAsset(`/samples/rosette/${reference.id}.analysis-input.png`),
  expectedInputPath: publicAsset(`/samples/rosette/${reference.id}.input.float32.bin`),
  expectedOutputPath: publicAsset(`/samples/rosette/${reference.id}.expected.float32.bin`),
  expectedDetectionsPath: publicAsset(`/samples/rosette/${reference.id}.expected.json`),
}));

type ClassificationReference = (typeof ABNORMAL_REFERENCES)[number];

let cachedSession: ort.InferenceSession | null = null;
let cachedLoadMilliseconds = 0;
let cachedEbSession: ort.InferenceSession | null = null;
let cachedEbLoadMilliseconds = 0;
let cachedAbnormalClassificationSession: ort.InferenceSession | null = null;
let cachedAbnormalClassificationLoadMilliseconds = 0;
let cachedBuddingClassificationSession: ort.InferenceSession | null = null;
let cachedBuddingClassificationLoadMilliseconds = 0;
let cachedRosetteSession: ort.InferenceSession | null = null;
let cachedRosetteLoadMilliseconds = 0;

type ValidationResult = {
  modelLoadSeconds: number;
  inferenceSeconds: number;
  maxInputError: number;
  maxProbabilityError: number;
  disagreementPixels: number;
  dice: number;
  foregroundPixels: number;
  usedCachedModel: boolean;
};

type ClassificationResult = {
  predictedLabel: "Abnormal" | "Budding" | "Normal";
  targetProbability: number;
  normalProbability: number;
  modelLoadSeconds: number;
  inferenceSeconds: number;
  usedCachedModel: boolean;
  isReference: boolean;
  classMatchesDesktop: boolean | null;
  maxInputError: number | null;
  maxProbabilityError: number | null;
};

type EbRegionMeasurement = {
  regionId: number;
  areaPixels: number;
  feretPixels: number;
};

type EbMorphology = {
  originalWidth: number;
  originalHeight: number;
  regionCount: number;
  meanAreaPixels: number;
  meanFeretPixels: number;
  regions: EbRegionMeasurement[];
};

type EbAnalysisResult = {
  modelLoadSeconds: number;
  inferenceSeconds: number;
  usedCachedModel: boolean;
  isReference: boolean;
  validation: {
    maxInputError: number;
    maxProbabilityError: number;
    disagreementPixels: number;
    dice: number;
  } | null;
  morphology: EbMorphology;
};

type RosetteDetection = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  classId: number;
};

type RosetteExpectedPayload = {
  original_width: number;
  original_height: number;
  input_width: number;
  input_height: number;
  ground_truth_count: number;
  detections: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    confidence: number;
    class_id: number;
  }>;
};

type RosetteResult = {
  detections: RosetteDetection[];
  originalWidth: number;
  originalHeight: number;
  inputWidth: number;
  inputHeight: number;
  modelLoadSeconds: number;
  inferenceSeconds: number;
  usedCachedModel: boolean;
  isReference: boolean;
  maxInputError: number | null;
  maxRawOutputError: number | null;
  detectionCountMatches: boolean | null;
  minimumMatchedIou: number | null;
};

type ActiveModule = "classification" | "segmentation" | "rosette";
type ClassificationMode = "abnormal" | "budding";
type SegmentationMode = "bo" | "eb";

async function loadFloat32(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Reference file could not be loaded (${response.status}).`);
  }
  return new Float32Array(await response.arrayBuffer());
}

async function loadImage(path: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Reference image could not be loaded."));
    image.src = path;
  });
}

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Reference metadata could not be loaded (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

async function getSession() {
  if (cachedSession) {
    return { session: cachedSession, usedCachedModel: true };
  }

  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = {
    mjs: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.mjs")}`,
    wasm: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.wasm")}`,
  };

  const started = performance.now();
  cachedSession = await ort.InferenceSession.create(publicAsset("/models/bo_fp32.onnx"), {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    externalData: [
      {
        path: "bo_fp32.weights-0.bin",
        data: publicAsset("/models/bo_fp32.weights-0.bin"),
      },
      {
        path: "bo_fp32.weights-1.bin",
        data: publicAsset("/models/bo_fp32.weights-1.bin"),
      },
    ],
  });
  cachedLoadMilliseconds = performance.now() - started;
  return { session: cachedSession, usedCachedModel: false };
}

async function getEbSession() {
  if (cachedEbSession) {
    return { session: cachedEbSession, usedCachedModel: true };
  }

  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = {
    mjs: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.mjs")}`,
    wasm: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.wasm")}`,
  };

  const started = performance.now();
  cachedEbSession = await ort.InferenceSession.create(publicAsset("/models/eb_fp32.onnx"), {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    externalData: [
      {
        path: "eb_fp32.weights-0.bin",
        data: publicAsset("/models/eb_fp32.weights-0.bin"),
      },
      {
        path: "eb_fp32.weights-1.bin",
        data: publicAsset("/models/eb_fp32.weights-1.bin"),
      },
    ],
  });
  cachedEbLoadMilliseconds = performance.now() - started;
  return { session: cachedEbSession, usedCachedModel: false };
}

async function getClassificationSession(mode: ClassificationMode) {
  const cachedSession =
    mode === "abnormal"
      ? cachedAbnormalClassificationSession
      : cachedBuddingClassificationSession;
  const cachedLoadMilliseconds =
    mode === "abnormal"
      ? cachedAbnormalClassificationLoadMilliseconds
      : cachedBuddingClassificationLoadMilliseconds;
  if (cachedSession) {
    return {
      session: cachedSession,
      usedCachedModel: true,
      loadMilliseconds: cachedLoadMilliseconds,
    };
  }

  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = {
    mjs: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.mjs")}`,
    wasm: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.wasm")}`,
  };

  const started = performance.now();
  const session = await ort.InferenceSession.create(
    mode === "abnormal"
      ? publicAsset("/models/abnormal_normal_fp32.onnx")
      : publicAsset("/models/budding_normal_fp32.onnx"),
    {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    },
  );
  const loadMilliseconds = performance.now() - started;
  if (mode === "abnormal") {
    cachedAbnormalClassificationSession = session;
    cachedAbnormalClassificationLoadMilliseconds = loadMilliseconds;
  } else {
    cachedBuddingClassificationSession = session;
    cachedBuddingClassificationLoadMilliseconds = loadMilliseconds;
  }
  return { session, usedCachedModel: false, loadMilliseconds };
}

async function getRosetteSession() {
  if (cachedRosetteSession) {
    return { session: cachedRosetteSession, usedCachedModel: true };
  }

  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = {
    mjs: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.mjs")}`,
    wasm: `${window.location.origin}${publicAsset("/ort/ort-wasm-simd-threaded.wasm")}`,
  };

  const started = performance.now();
  cachedRosetteSession = await ort.InferenceSession.create(
    publicAsset("/models/rosette_fp32.onnx"),
    {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
      externalData: [
        {
          path: "rosette_fp32.weights-0.bin",
          data: publicAsset("/models/rosette_fp32.weights-0.bin"),
        },
        {
          path: "rosette_fp32.weights-1.bin",
          data: publicAsset("/models/rosette_fp32.weights-1.bin"),
        },
      ],
    },
  );
  cachedRosetteLoadMilliseconds = performance.now() - started;
  return { session: cachedRosetteSession, usedCachedModel: false };
}

function drawBinaryMask(canvas: HTMLCanvasElement, prediction: Float32Array) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The result canvas is unavailable.");

  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const binaryMask = context.createImageData(IMAGE_SIZE, IMAGE_SIZE);

  for (let index = 0; index < prediction.length; index += 1) {
    const value = prediction[index] > 0.5 ? 255 : 0;
    const pixel = index * 4;
    binaryMask.data[pixel] = value;
    binaryMask.data[pixel + 1] = value;
    binaryMask.data[pixel + 2] = value;
    binaryMask.data[pixel + 3] = 255;
  }

  context.putImageData(binaryMask, 0, 0);
}

type Point = { x: number; y: number };

function resizeGrayBilinear(
  source: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const resized = new Uint8Array(targetWidth * targetHeight);
  const scaleX = sourceWidth / targetWidth;
  const scaleY = sourceHeight / targetHeight;

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = (y + 0.5) * scaleY - 0.5;
    const y0 = Math.max(0, Math.min(sourceHeight - 1, Math.floor(sourceY)));
    const y1 = Math.max(0, Math.min(sourceHeight - 1, y0 + 1));
    const yWeight = sourceY < 0 ? 0 : Math.min(1, sourceY - Math.floor(sourceY));

    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = (x + 0.5) * scaleX - 0.5;
      const x0 = Math.max(0, Math.min(sourceWidth - 1, Math.floor(sourceX)));
      const x1 = Math.max(0, Math.min(sourceWidth - 1, x0 + 1));
      const xWeight = sourceX < 0 ? 0 : Math.min(1, sourceX - Math.floor(sourceX));
      const top =
        source[y0 * sourceWidth + x0] * (1 - xWeight) +
        source[y0 * sourceWidth + x1] * xWeight;
      const bottom =
        source[y1 * sourceWidth + x0] * (1 - xWeight) +
        source[y1 * sourceWidth + x1] * xWeight;
      resized[y * targetWidth + x] = Math.round(
        top * (1 - yWeight) + bottom * yWeight,
      );
    }
  }

  return resized;
}

function prepareUserEbInput(image: HTMLImageElement, canvas: HTMLCanvasElement) {
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) throw new Error("The selected EB image could not be prepared.");
  sourceContext.drawImage(image, 0, 0);
  const rgba = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data;
  const grayscale = new Uint8Array(sourceWidth * sourceHeight);
  for (let index = 0; index < grayscale.length; index += 1) {
    const rgbaIndex = index * 4;
    grayscale[index] = Math.round(
      rgba[rgbaIndex] * 0.299 +
        rgba[rgbaIndex + 1] * 0.587 +
        rgba[rgbaIndex + 2] * 0.114,
    );
  }

  const resized = resizeGrayBilinear(
    grayscale,
    sourceWidth,
    sourceHeight,
    IMAGE_SIZE,
    IMAGE_SIZE,
  );
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The EB model input could not be displayed.");
  const imageData = context.createImageData(IMAGE_SIZE, IMAGE_SIZE);
  const input = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);
  for (let index = 0; index < resized.length; index += 1) {
    input[index] = resized[index] / 255;
    const pixel = index * 4;
    imageData.data[pixel] = resized[index];
    imageData.data[pixel + 1] = resized[index];
    imageData.data[pixel + 2] = resized[index];
    imageData.data[pixel + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
  return input;
}

function resizePredictionToMask(
  prediction: Float32Array,
  targetWidth: number,
  targetHeight: number,
) {
  const targetPixels = targetWidth * targetHeight;
  if (
    targetWidth < 1 ||
    targetHeight < 1 ||
    targetWidth > 8192 ||
    targetHeight > 8192 ||
    targetPixels > 25_000_000
  ) {
    throw new Error(
      "This image is too large for safe in-browser morphology analysis. Use an image up to 8192 px per side and 25 megapixels.",
    );
  }

  const mask = new Uint8Array(targetPixels);
  const scaleX = IMAGE_SIZE / targetWidth;
  const scaleY = IMAGE_SIZE / targetHeight;
  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = (y + 0.5) * scaleY - 0.5;
    const yFloor = Math.floor(sourceY);
    const y0 = Math.max(0, Math.min(IMAGE_SIZE - 1, yFloor));
    const y1 = Math.max(0, Math.min(IMAGE_SIZE - 1, y0 + 1));
    const yWeight = sourceY < 0 ? 0 : Math.min(1, sourceY - yFloor);
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = (x + 0.5) * scaleX - 0.5;
      const xFloor = Math.floor(sourceX);
      const x0 = Math.max(0, Math.min(IMAGE_SIZE - 1, xFloor));
      const x1 = Math.max(0, Math.min(IMAGE_SIZE - 1, x0 + 1));
      const xWeight = sourceX < 0 ? 0 : Math.min(1, sourceX - xFloor);
      const top =
        prediction[y0 * IMAGE_SIZE + x0] * (1 - xWeight) +
        prediction[y0 * IMAGE_SIZE + x1] * xWeight;
      const bottom =
        prediction[y1 * IMAGE_SIZE + x0] * (1 - xWeight) +
        prediction[y1 * IMAGE_SIZE + x1] * xWeight;
      const probability = top * (1 - yWeight) + bottom * yWeight;
      mask[y * targetWidth + x] = probability > 0.5 ? 1 : 0;
    }
  }
  return mask;
}

function drawBinaryMaskData(
  canvas: HTMLCanvasElement,
  mask: Uint8Array,
  width: number,
  height: number,
) {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The EB mask could not be displayed.");
  const imageData = context.createImageData(width, height);
  for (let index = 0; index < mask.length; index += 1) {
    const value = mask[index] ? 255 : 0;
    const pixel = index * 4;
    imageData.data[pixel] = value;
    imageData.data[pixel + 1] = value;
    imageData.data[pixel + 2] = value;
    imageData.data[pixel + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
}

function cross(origin: Point, first: Point, second: Point) {
  return (
    (first.x - origin.x) * (second.y - origin.y) -
    (first.y - origin.y) * (second.x - origin.x)
  );
}

function convexHull(points: Point[]) {
  const sorted = [...points].sort((left, right) => left.x - right.x || left.y - right.y);
  const unique = sorted.filter(
    (point, index) =>
      index === 0 ||
      point.x !== sorted[index - 1].x ||
      point.y !== sorted[index - 1].y,
  );
  if (unique.length <= 2) return unique;
  const lower: Point[] = [];
  for (const point of unique) {
    while (lower.length >= 2 && cross(lower.at(-2)!, lower.at(-1)!, point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Point[] = [];
  for (let index = unique.length - 1; index >= 0; index -= 1) {
    const point = unique[index];
    while (upper.length >= 2 && cross(upper.at(-2)!, upper.at(-1)!, point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

function pointInConvexPolygon(point: Point, polygon: Point[]) {
  if (polygon.length < 3) return false;
  let sign = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const value = cross(polygon[index], polygon[(index + 1) % polygon.length], point);
    if (Math.abs(value) < 1e-10) continue;
    const currentSign = Math.sign(value);
    if (sign === 0) sign = currentSign;
    else if (sign !== currentSign) return false;
  }
  return true;
}

function regionFeretDiameter(
  rowExtents: Map<number, [number, number]>,
  columnExtents: Map<number, [number, number]>,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
) {
  const possibleHull: Point[] = [];
  rowExtents.forEach(([rowMin, rowMax], y) => {
    possibleHull.push({ x: rowMin, y }, { x: rowMax, y });
  });
  columnExtents.forEach(([columnMin, columnMax], x) => {
    possibleHull.push({ x, y: columnMin }, { x, y: columnMax });
  });
  const offsetPoints = possibleHull.flatMap((point) => [
    { x: point.x - 0.5, y: point.y },
    { x: point.x + 0.5, y: point.y },
    { x: point.x, y: point.y - 0.5 },
    { x: point.x, y: point.y + 0.5 },
  ]);
  const polygon = convexHull(offsetPoints);
  const hullWidth = maxX - minX + 1;
  const hullHeight = maxY - minY + 1;
  const hullMask = new Uint8Array(hullWidth * hullHeight);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (pointInConvexPolygon({ x, y }, polygon)) {
        hullMask[(y - minY) * hullWidth + (x - minX)] = 1;
      }
    }
  }

  const contourPoints: Point[] = [];
  for (let y = 0; y < hullHeight; y += 1) {
    for (let x = 0; x < hullWidth; x += 1) {
      if (!hullMask[y * hullWidth + x]) continue;
      if (y === 0 || !hullMask[(y - 1) * hullWidth + x]) {
        contourPoints.push({ x: x + minX, y: y + minY - 0.5 });
      }
      if (y === hullHeight - 1 || !hullMask[(y + 1) * hullWidth + x]) {
        contourPoints.push({ x: x + minX, y: y + minY + 0.5 });
      }
      if (x === 0 || !hullMask[y * hullWidth + x - 1]) {
        contourPoints.push({ x: x + minX - 0.5, y: y + minY });
      }
      if (x === hullWidth - 1 || !hullMask[y * hullWidth + x + 1]) {
        contourPoints.push({ x: x + minX + 0.5, y: y + minY });
      }
    }
  }

  const contourHull = convexHull(contourPoints);
  let maximumSquaredDistance = 0;
  for (let first = 0; first < contourHull.length; first += 1) {
    for (let second = first + 1; second < contourHull.length; second += 1) {
      const deltaX = contourHull[first].x - contourHull[second].x;
      const deltaY = contourHull[first].y - contourHull[second].y;
      maximumSquaredDistance = Math.max(
        maximumSquaredDistance,
        deltaX * deltaX + deltaY * deltaY,
      );
    }
  }
  return Math.sqrt(maximumSquaredDistance);
}

function analyzeEbMask(mask: Uint8Array, width: number, height: number): EbMorphology {
  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const regions: EbRegionMeasurement[] = [];
  const neighborOffsets = [-1, 0, 1];

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    let areaPixels = 0;
    let minX = width;
    let maxX = -1;
    let minY = height;
    let maxY = -1;
    const rowExtents = new Map<number, [number, number]>();
    const columnExtents = new Map<number, [number, number]>();
    queue[tail] = start;
    tail += 1;
    visited[start] = 1;

    while (head < tail) {
      const current = queue[head];
      head += 1;
      const y = Math.floor(current / width);
      const x = current - y * width;
      areaPixels += 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      const row = rowExtents.get(y);
      rowExtents.set(y, row ? [Math.min(row[0], x), Math.max(row[1], x)] : [x, x]);
      const column = columnExtents.get(x);
      columnExtents.set(
        x,
        column ? [Math.min(column[0], y), Math.max(column[1], y)] : [y, y],
      );

      for (const deltaY of neighborOffsets) {
        const neighborY = y + deltaY;
        if (neighborY < 0 || neighborY >= height) continue;
        for (const deltaX of neighborOffsets) {
          if (deltaX === 0 && deltaY === 0) continue;
          const neighborX = x + deltaX;
          if (neighborX < 0 || neighborX >= width) continue;
          const neighbor = neighborY * width + neighborX;
          if (mask[neighbor] && !visited[neighbor]) {
            visited[neighbor] = 1;
            queue[tail] = neighbor;
            tail += 1;
          }
        }
      }
    }

    regions.push({
      regionId: regions.length + 1,
      areaPixels,
      feretPixels: regionFeretDiameter(
        rowExtents,
        columnExtents,
        minX,
        maxX,
        minY,
        maxY,
      ),
    });
  }

  const totalArea = regions.reduce((sum, region) => sum + region.areaPixels, 0);
  const totalFeret = regions.reduce((sum, region) => sum + region.feretPixels, 0);
  return {
    originalWidth: width,
    originalHeight: height,
    regionCount: regions.length,
    meanAreaPixels: regions.length ? totalArea / regions.length : 0,
    meanFeretPixels: regions.length ? totalFeret / regions.length : 0,
    regions,
  };
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function nowMilliseconds() {
  return performance.now();
}

function canvasToRosetteTensor(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("The rosette model input could not be prepared.");
  const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const planeSize = canvas.width * canvas.height;
  const input = new Float32Array(planeSize * 3);
  for (let index = 0; index < planeSize; index += 1) {
    const pixel = index * 4;
    input[index] = rgba[pixel] / 255;
    input[planeSize + index] = rgba[pixel + 1] / 255;
    input[planeSize * 2 + index] = rgba[pixel + 2] / 255;
  }
  return input;
}

function prepareUserRosetteInput(image: HTMLImageElement, canvas: HTMLCanvasElement) {
  const size = 704;
  const stride = 32;
  const ratio = Math.min(size / image.naturalHeight, size / image.naturalWidth);
  const resizedWidth = Math.round(image.naturalWidth * ratio);
  const resizedHeight = Math.round(image.naturalHeight * ratio);
  const padWidth = (size - resizedWidth) % stride;
  const padHeight = (size - resizedHeight) % stride;
  const left = Math.round(padWidth / 2 - 0.1);
  const right = Math.round(padWidth / 2 + 0.1);
  const top = Math.round(padHeight / 2 - 0.1);
  const bottom = Math.round(padHeight / 2 + 0.1);
  canvas.width = resizedWidth + left + right;
  canvas.height = resizedHeight + top + bottom;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("The selected rosette image could not be prepared.");
  context.fillStyle = "rgb(114, 114, 114)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, left, top, resizedWidth, resizedHeight);
  return {
    input: canvasToRosetteTensor(canvas),
    inputWidth: canvas.width,
    inputHeight: canvas.height,
  };
}

function boxIou(left: RosetteDetection, right: RosetteDetection) {
  const intersectionWidth = Math.max(0, Math.min(left.x2, right.x2) - Math.max(left.x1, right.x1));
  const intersectionHeight = Math.max(0, Math.min(left.y2, right.y2) - Math.max(left.y1, right.y1));
  const intersection = intersectionWidth * intersectionHeight;
  const leftArea = Math.max(0, left.x2 - left.x1) * Math.max(0, left.y2 - left.y1);
  const rightArea = Math.max(0, right.x2 - right.x1) * Math.max(0, right.y2 - right.y1);
  const union = leftArea + rightArea - intersection;
  return union > 0 ? intersection / union : 0;
}

function nonMaximumSuppression(detections: RosetteDetection[], iouThreshold = 0.7) {
  const candidates = [...detections].sort(
    (left, right) => right.confidence - left.confidence,
  );
  const selected: RosetteDetection[] = [];
  while (candidates.length && selected.length < 300) {
    const best = candidates.shift()!;
    selected.push(best);
    for (let index = candidates.length - 1; index >= 0; index -= 1) {
      if (boxIou(best, candidates[index]) > iouThreshold) candidates.splice(index, 1);
    }
  }
  return selected;
}

function postprocessRosetteOutput(
  raw: Float32Array,
  outputDimensions: readonly number[],
  inputWidth: number,
  inputHeight: number,
  originalWidth: number,
  originalHeight: number,
) {
  const anchorCount = outputDimensions[2];
  const candidates: RosetteDetection[] = [];
  for (let index = 0; index < anchorCount; index += 1) {
    const confidence = raw[anchorCount * 4 + index];
    if (confidence < 0.25) continue;
    const centerX = raw[index];
    const centerY = raw[anchorCount + index];
    const width = raw[anchorCount * 2 + index];
    const height = raw[anchorCount * 3 + index];
    candidates.push({
      x1: centerX - width / 2,
      y1: centerY - height / 2,
      x2: centerX + width / 2,
      y2: centerY + height / 2,
      confidence,
      classId: 0,
    });
  }

  const detections = nonMaximumSuppression(candidates);
  const gain = Math.min(inputHeight / originalHeight, inputWidth / originalWidth);
  const padX = (inputWidth - originalWidth * gain) / 2;
  const padY = (inputHeight - originalHeight * gain) / 2;
  return detections.map((detection) => ({
    ...detection,
    x1: Math.max(0, Math.min(originalWidth, (detection.x1 - padX) / gain)),
    y1: Math.max(0, Math.min(originalHeight, (detection.y1 - padY) / gain)),
    x2: Math.max(0, Math.min(originalWidth, (detection.x2 - padX) / gain)),
    y2: Math.max(0, Math.min(originalHeight, (detection.y2 - padY) / gain)),
  }));
}

function drawRosetteDetections(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  detections: RosetteDetection[],
) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The annotated rosette image could not be displayed.");
  context.drawImage(image, 0, 0);
  const lineWidth = Math.max(2, image.naturalWidth / 520);
  const fontSize = Math.max(14, image.naturalWidth / 80);
  context.lineWidth = lineWidth;
  context.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  for (const detection of detections) {
    const width = detection.x2 - detection.x1;
    const height = detection.y2 - detection.y1;
    const label = `Rosette ${(detection.confidence * 100).toFixed(0)}%`;
    const textWidth = context.measureText(label).width;
    const labelHeight = fontSize * 1.35;
    const labelY = Math.max(0, detection.y1 - labelHeight);
    context.strokeStyle = "#ffffff";
    context.strokeRect(detection.x1, detection.y1, width, height);
    context.fillStyle = "rgba(5, 5, 5, 0.88)";
    context.fillRect(detection.x1, labelY, textWidth + fontSize * 0.7, labelHeight);
    context.fillStyle = "#ffffff";
    context.fillText(label, detection.x1 + fontSize * 0.3, labelY + fontSize);
  }
}

function minimumMatchedIou(
  detections: RosetteDetection[],
  expected: RosetteDetection[],
) {
  if (!detections.length && !expected.length) return 1;
  if (!detections.length || !expected.length) return 0;
  const remaining = [...expected];
  let minimum = 1;
  for (const detection of detections) {
    let bestIndex = -1;
    let bestIou = -1;
    for (let index = 0; index < remaining.length; index += 1) {
      const iou = boxIou(detection, remaining[index]);
      if (iou > bestIou) {
        bestIou = iou;
        bestIndex = index;
      }
    }
    if (bestIndex >= 0) remaining.splice(bestIndex, 1);
    minimum = Math.min(minimum, Math.max(0, bestIou));
  }
  return remaining.length ? 0 : minimum;
}

export default function Home() {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const ebInputCanvasRef = useRef<HTMLCanvasElement>(null);
  const ebOutputCanvasRef = useRef<HTMLCanvasElement>(null);
  const classificationCanvasRef = useRef<HTMLCanvasElement>(null);
  const rosettePreprocessCanvasRef = useRef<HTMLCanvasElement>(null);
  const rosetteOutputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Ready for the reference test");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pixelSizeInput, setPixelSizeInput] = useState("1.0");
  const [activeModule, setActiveModule] = useState<ActiveModule>("segmentation");
  const [classificationMode, setClassificationMode] =
    useState<ClassificationMode>("abnormal");
  const [segmentationMode, setSegmentationMode] = useState<SegmentationMode>("bo");
  const [boReferenceId, setBoReferenceId] =
    useState<(typeof BO_REFERENCES)[number]["id"]>(BO_REFERENCES[0].id);
  const [ebReferenceId, setEbReferenceId] = useState(EB_REFERENCES[0].id);
  const [ebImagePath, setEbImagePath] = useState(EB_REFERENCES[0].imagePath);
  const [ebFileName, setEbFileName] = useState(EB_REFERENCES[0].displayName);
  const [ebUsesReference, setEbUsesReference] = useState(true);
  const [ebStatus, setEbStatus] = useState("Ready for the published reference test");
  const [ebIsRunning, setEbIsRunning] = useState(false);
  const [ebResult, setEbResult] = useState<EbAnalysisResult | null>(null);
  const [ebError, setEbError] = useState<string | null>(null);
  const [classificationReferenceSlug, setClassificationReferenceSlug] = useState(
    ABNORMAL_REFERENCES[0].slug,
  );
  const [classificationImagePath, setClassificationImagePath] = useState(
    ABNORMAL_REFERENCES[0].imagePath,
  );
  const [classificationFileName, setClassificationFileName] = useState(
    ABNORMAL_REFERENCES[0].displayName,
  );
  const [classificationUsesReference, setClassificationUsesReference] = useState(true);
  const [classificationIsRunning, setClassificationIsRunning] = useState(false);
  const [classificationStatus, setClassificationStatus] = useState(
    "Ready for the released reference test",
  );
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(null);
  const [rosetteReferenceId, setRosetteReferenceId] = useState(
    ROSETTE_REFERENCES[0].id,
  );
  const [rosetteImagePath, setRosetteImagePath] = useState(
    ROSETTE_REFERENCES[0].imagePath,
  );
  const [rosetteFileName, setRosetteFileName] = useState(
    ROSETTE_REFERENCES[0].displayName,
  );
  const [rosetteUsesReference, setRosetteUsesReference] = useState(true);
  const [rosetteStatus, setRosetteStatus] = useState(
    "Ready for the released reference test",
  );
  const [rosetteIsRunning, setRosetteIsRunning] = useState(false);
  const [rosetteResult, setRosetteResult] = useState<RosetteResult | null>(null);
  const [rosetteError, setRosetteError] = useState<string | null>(null);

  const selectedBoReference =
    BO_REFERENCES.find((reference) => reference.id === boReferenceId) ?? BO_REFERENCES[0];
  const selectedEbReference =
    EB_REFERENCES.find((reference) => reference.id === ebReferenceId) ?? EB_REFERENCES[0];
  const activeClassificationReferences =
    classificationMode === "abnormal" ? ABNORMAL_REFERENCES : BUDDING_REFERENCES;
  const selectedClassificationReference =
    activeClassificationReferences.find(
      (reference) => reference.slug === classificationReferenceSlug,
    ) ?? activeClassificationReferences[0];
  const selectedRosetteReference =
    ROSETTE_REFERENCES.find((reference) => reference.id === rosetteReferenceId) ??
    ROSETTE_REFERENCES[0];
  const classificationTargetLabel =
    classificationMode === "abnormal" ? "Abnormal" : "Budding";
  const classificationModelSize = classificationMode === "abnormal" ? "30.5 MB" : "99.2 MB";

  const pixelSize = Number(pixelSizeInput);
  const hasValidPixelSize = Number.isFinite(pixelSize) && pixelSize > 0;
  const showMorphology = Boolean(result && hasValidPixelSize);
  const showEbMorphology = Boolean(ebResult && hasValidPixelSize);

  const runReferenceTest = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      setStatus("Loading the reference image…");
      const [image, expectedInput, expectedOutput] = await Promise.all([
        loadImage(selectedBoReference.imagePath),
        loadFloat32(selectedBoReference.expectedInputPath),
        loadFloat32(selectedBoReference.expectedOutputPath),
      ]);

      const inputCanvas = inputCanvasRef.current;
      const outputCanvas = outputCanvasRef.current;
      if (!inputCanvas || !outputCanvas) {
        throw new Error("The image canvases are unavailable.");
      }

      inputCanvas.width = IMAGE_SIZE;
      inputCanvas.height = IMAGE_SIZE;
      const inputContext = inputCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!inputContext) throw new Error("The input canvas is unavailable.");
      inputContext.drawImage(image, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
      const rgba = inputContext.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE).data;
      const input = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);
      let maxInputError = 0;
      for (let index = 0; index < input.length; index += 1) {
        input[index] = rgba[index * 4] / 255;
        maxInputError = Math.max(
          maxInputError,
          Math.abs(input[index] - expectedInput[index]),
        );
      }

      setStatus(
        cachedSession ? "Running the cached model…" : "Loading the local AI model…",
      );
      const { session, usedCachedModel } = await getSession();
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];

      const inferenceStarted = nowMilliseconds();
      const outputs = await session.run({
        [inputName]: new ort.Tensor("float32", input, [1, IMAGE_SIZE, IMAGE_SIZE, 1]),
      });
      const inferenceSeconds = (nowMilliseconds() - inferenceStarted) / 1000;
      const prediction = outputs[outputName].data as Float32Array;

      let maxProbabilityError = 0;
      let disagreementPixels = 0;
      let predictedForeground = 0;
      let expectedForeground = 0;
      let intersection = 0;

      for (let index = 0; index < prediction.length; index += 1) {
        maxProbabilityError = Math.max(
          maxProbabilityError,
          Math.abs(prediction[index] - expectedOutput[index]),
        );
        const predicted = prediction[index] > 0.5;
        const expected = expectedOutput[index] > 0.5;
        if (predicted !== expected) disagreementPixels += 1;
        if (predicted) predictedForeground += 1;
        if (expected) expectedForeground += 1;
        if (predicted && expected) intersection += 1;
      }

      drawBinaryMask(outputCanvas, prediction);
      const dice = (2 * intersection) / (predictedForeground + expectedForeground);
      setResult({
        modelLoadSeconds: cachedLoadMilliseconds / 1000,
        inferenceSeconds,
        maxInputError,
        maxProbabilityError,
        disagreementPixels,
        dice,
        foregroundPixels: predictedForeground,
        usedCachedModel,
      });
      setStatus(
        disagreementPixels === 0 ? "Validation passed" : "Validation needs review",
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "An unexpected error occurred.";
      setError(message);
      setStatus("Validation could not be completed");
    } finally {
      setIsRunning(false);
    }
  };

  const selectBoReference = (referenceId: (typeof BO_REFERENCES)[number]["id"]) => {
    setBoReferenceId(referenceId);
    setResult(null);
    setError(null);
    setStatus("Ready for the selected reference test");
  };

  const selectEbReference = (referenceId: string) => {
    const reference =
      EB_REFERENCES.find((candidate) => candidate.id === referenceId) ?? EB_REFERENCES[0];
    setEbImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return reference.imagePath;
    });
    setEbReferenceId(referenceId);
    setEbFileName(reference.displayName);
    setEbUsesReference(true);
    setEbResult(null);
    setEbError(null);
    setEbStatus("Ready for the selected published reference test");
  };

  const selectEbImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setEbImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return URL.createObjectURL(file);
    });
    setEbFileName(file.name);
    setEbUsesReference(false);
    setEbResult(null);
    setEbError(null);
    setEbStatus("Image ready for local EB analysis");
  };

  const useEbReference = () => selectEbReference(ebReferenceId);

  const runEbAnalysis = async () => {
    if (ebIsRunning) return;
    setEbIsRunning(true);
    setEbError(null);
    setEbResult(null);

    try {
      setEbStatus(
        ebUsesReference ? "Loading the published reference…" : "Preparing your image…",
      );
      const [sourceImage, analysisImage, expectedInput, expectedOutput] = await Promise.all([
        loadImage(ebImagePath),
        ebUsesReference
          ? loadImage(selectedEbReference.analysisInputPath)
          : Promise.resolve(null),
        ebUsesReference
          ? loadFloat32(selectedEbReference.expectedInputPath)
          : Promise.resolve(null),
        ebUsesReference
          ? loadFloat32(selectedEbReference.expectedOutputPath)
          : Promise.resolve(null),
      ]);
      const sourcePixels = sourceImage.naturalWidth * sourceImage.naturalHeight;
      if (
        sourceImage.naturalWidth > 8192 ||
        sourceImage.naturalHeight > 8192 ||
        sourcePixels > 25_000_000
      ) {
        throw new Error(
          "This image is too large for safe in-browser morphology analysis. Use an image up to 8192 px per side and 25 megapixels.",
        );
      }

      const inputCanvas = ebInputCanvasRef.current;
      const outputCanvas = ebOutputCanvasRef.current;
      if (!inputCanvas || !outputCanvas) {
        throw new Error("The EB image canvases are unavailable.");
      }

      let maxInputError = 0;
      let input: Float32Array;
      if (analysisImage && expectedInput) {
        inputCanvas.width = IMAGE_SIZE;
        inputCanvas.height = IMAGE_SIZE;
        const inputContext = inputCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!inputContext) throw new Error("The EB input canvas is unavailable.");
        inputContext.drawImage(analysisImage, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        const rgba = inputContext.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE).data;
        input = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);
        for (let index = 0; index < input.length; index += 1) {
          input[index] = rgba[index * 4] / 255;
          maxInputError = Math.max(
            maxInputError,
            Math.abs(input[index] - expectedInput[index]),
          );
        }
      } else {
        input = prepareUserEbInput(sourceImage, inputCanvas);
      }

      setEbStatus(
        cachedEbSession ? "Running the cached EB model…" : "Loading the local EB model…",
      );
      const { session, usedCachedModel } = await getEbSession();
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];
      const inferenceStarted = nowMilliseconds();
      const outputs = await session.run({
        [inputName]: new ort.Tensor("float32", input, [1, IMAGE_SIZE, IMAGE_SIZE, 1]),
      });
      const inferenceSeconds = (nowMilliseconds() - inferenceStarted) / 1000;
      const prediction = outputs[outputName].data as Float32Array;

      let validation: EbAnalysisResult["validation"] = null;
      if (expectedOutput) {
        let maxProbabilityError = 0;
        let disagreementPixels = 0;
        let predictedForeground = 0;
        let expectedForeground = 0;
        let intersection = 0;
        for (let index = 0; index < prediction.length; index += 1) {
          maxProbabilityError = Math.max(
            maxProbabilityError,
            Math.abs(prediction[index] - expectedOutput[index]),
          );
          const predicted = prediction[index] > 0.5;
          const expected = expectedOutput[index] > 0.5;
          if (predicted !== expected) disagreementPixels += 1;
          if (predicted) predictedForeground += 1;
          if (expected) expectedForeground += 1;
          if (predicted && expected) intersection += 1;
        }
        const denominator = predictedForeground + expectedForeground;
        validation = {
          maxInputError,
          maxProbabilityError,
          disagreementPixels,
          dice: denominator === 0 ? 1 : (2 * intersection) / denominator,
        };
      }

      setEbStatus("Measuring connected EB regions…");
      const mask = resizePredictionToMask(
        prediction,
        sourceImage.naturalWidth,
        sourceImage.naturalHeight,
      );
      drawBinaryMaskData(
        outputCanvas,
        mask,
        sourceImage.naturalWidth,
        sourceImage.naturalHeight,
      );
      const morphology = analyzeEbMask(
        mask,
        sourceImage.naturalWidth,
        sourceImage.naturalHeight,
      );
      setEbResult({
        modelLoadSeconds: cachedEbLoadMilliseconds / 1000,
        inferenceSeconds,
        usedCachedModel,
        isReference: ebUsesReference,
        validation,
        morphology,
      });
      setEbStatus(
        validation
          ? validation.disagreementPixels === 0
            ? "Desktop EB mask confirmed"
            : "EB reference result needs review"
          : `Analysis complete · ${morphology.regionCount} connected regions`,
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "EB validation could not be completed.";
      setEbError(message);
      setEbStatus("EB validation could not be completed");
    } finally {
      setEbIsRunning(false);
    }
  };

  const ebDownloadBase = ebFileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "brain-eb";

  const downloadEbMask = () => {
    const canvas = ebOutputCanvasRef.current;
    if (!canvas || !ebResult) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${ebDownloadBase}-mask.png`);
    }, "image/png");
  };

  const downloadEbMeasurements = () => {
    if (!ebResult || !hasValidPixelSize) return;
    const morphology = ebResult.morphology;
    const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const lines = [
      "field,value",
      `source_file,${escapeCsv(ebFileName)}`,
      `image_width_px,${morphology.originalWidth}`,
      `image_height_px,${morphology.originalHeight}`,
      `pixel_size_um_per_px,${pixelSize}`,
      `detected_regions,${morphology.regionCount}`,
      `mean_area_px2,${morphology.meanAreaPixels}`,
      `mean_area_um2,${morphology.meanAreaPixels * pixelSize ** 2}`,
      `mean_feret_diameter_px,${morphology.meanFeretPixels}`,
      `mean_feret_diameter_um,${morphology.meanFeretPixels * pixelSize}`,
      "",
      "region_id,area_px2,area_um2,feret_diameter_px,feret_diameter_um",
      ...morphology.regions.map(
        (region) =>
          `${region.regionId},${region.areaPixels},${region.areaPixels * pixelSize ** 2},${region.feretPixels},${region.feretPixels * pixelSize}`,
      ),
    ];
    downloadBlob(
      new Blob([`\ufeff${lines.join("\n")}\n`], { type: "text/csv;charset=utf-8" }),
      `${ebDownloadBase}-measurements.csv`,
    );
  };

  const selectClassificationImage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setClassificationImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return URL.createObjectURL(file);
    });
    setClassificationFileName(file.name);
    setClassificationUsesReference(false);
    setClassificationResult(null);
    setClassificationError(null);
    setClassificationStatus("Image ready for local analysis");
  };

  const useClassificationReference = () => {
    setClassificationImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return selectedClassificationReference.imagePath;
    });
    setClassificationFileName(selectedClassificationReference.displayName);
    setClassificationUsesReference(true);
    setClassificationResult(null);
    setClassificationError(null);
    setClassificationStatus("Ready for the released reference test");
  };

  const selectClassificationReference = (
    reference: ClassificationReference,
  ) => {
    setClassificationImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return reference.imagePath;
    });
    setClassificationReferenceSlug(reference.slug);
    setClassificationFileName(reference.displayName);
    setClassificationUsesReference(true);
    setClassificationResult(null);
    setClassificationError(null);
    setClassificationStatus("Ready for the selected reference test");
  };

  const changeClassificationMode = (mode: ClassificationMode) => {
    const reference =
      mode === "abnormal" ? ABNORMAL_REFERENCES[0] : BUDDING_REFERENCES[0];
    setClassificationImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return reference.imagePath;
    });
    setClassificationMode(mode);
    setClassificationReferenceSlug(reference.slug);
    setClassificationFileName(reference.displayName);
    setClassificationUsesReference(true);
    setClassificationResult(null);
    setClassificationError(null);
    setClassificationStatus("Ready for the released reference test");
  };

  const runClassification = async () => {
    if (classificationIsRunning) return;
    const runningMode = classificationMode;
    setClassificationIsRunning(true);
    setClassificationResult(null);
    setClassificationError(null);

    try {
      setClassificationStatus("Preparing the image on this device…");
      const [image, expectedInput, expectedOutput] = await Promise.all([
        loadImage(classificationImagePath),
        classificationUsesReference
          ? loadFloat32(selectedClassificationReference.expectedInputPath)
          : Promise.resolve(null),
        classificationUsesReference
          ? loadFloat32(selectedClassificationReference.expectedOutputPath)
          : Promise.resolve(null),
      ]);

      const canvas = classificationCanvasRef.current;
      if (!canvas) throw new Error("The classification canvas is unavailable.");
      canvas.width = CLASSIFICATION_IMAGE_SIZE;
      canvas.height = CLASSIFICATION_IMAGE_SIZE;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("The classification image could not be prepared.");
      context.drawImage(
        image,
        0,
        0,
        CLASSIFICATION_IMAGE_SIZE,
        CLASSIFICATION_IMAGE_SIZE,
      );
      const rgba = context.getImageData(
        0,
        0,
        CLASSIFICATION_IMAGE_SIZE,
        CLASSIFICATION_IMAGE_SIZE,
      ).data;
      const input = new Float32Array(
        CLASSIFICATION_IMAGE_SIZE * CLASSIFICATION_IMAGE_SIZE * 3,
      );
      let maxInputError = 0;
      for (let pixelIndex = 0; pixelIndex < rgba.length / 4; pixelIndex += 1) {
        const rgbaIndex = pixelIndex * 4;
        const inputIndex = pixelIndex * 3;
        input[inputIndex] = rgba[rgbaIndex + 2] / 255;
        input[inputIndex + 1] = rgba[rgbaIndex + 1] / 255;
        input[inputIndex + 2] = rgba[rgbaIndex] / 255;
        if (expectedInput) {
          maxInputError = Math.max(
            maxInputError,
            Math.abs(input[inputIndex] - expectedInput[inputIndex]),
            Math.abs(input[inputIndex + 1] - expectedInput[inputIndex + 1]),
            Math.abs(input[inputIndex + 2] - expectedInput[inputIndex + 2]),
          );
        }
      }

      setClassificationStatus(
        runningMode === "abnormal"
          ? cachedAbnormalClassificationSession
            ? "Running the cached classifier…"
            : "Loading the local classifier…"
          : cachedBuddingClassificationSession
          ? "Running the cached classifier…"
          : "Loading the local classifier…",
      );
      const { session, usedCachedModel, loadMilliseconds } =
        await getClassificationSession(runningMode);
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];
      const inferenceStarted = nowMilliseconds();
      const outputs = await session.run({
        [inputName]: new ort.Tensor("float32", input, [
          1,
          CLASSIFICATION_IMAGE_SIZE,
          CLASSIFICATION_IMAGE_SIZE,
          3,
        ]),
      });
      const inferenceSeconds = (nowMilliseconds() - inferenceStarted) / 1000;
      const prediction = outputs[outputName].data as Float32Array;
      const predictedIndex = prediction[0] >= prediction[1] ? 0 : 1;

      let maxProbabilityError: number | null = null;
      let classMatchesDesktop: boolean | null = null;
      if (expectedOutput) {
        maxProbabilityError = Math.max(
          Math.abs(prediction[0] - expectedOutput[0]),
          Math.abs(prediction[1] - expectedOutput[1]),
        );
        const expectedIndex = expectedOutput[0] >= expectedOutput[1] ? 0 : 1;
        classMatchesDesktop = predictedIndex === expectedIndex;
      }

      setClassificationResult({
        predictedLabel:
          predictedIndex === 0
            ? runningMode === "abnormal"
              ? "Abnormal"
              : "Budding"
            : "Normal",
        targetProbability: prediction[0],
        normalProbability: prediction[1],
        modelLoadSeconds: loadMilliseconds / 1000,
        inferenceSeconds,
        usedCachedModel,
        isReference: classificationUsesReference,
        classMatchesDesktop,
        maxInputError: expectedInput ? maxInputError : null,
        maxProbabilityError,
      });
      setClassificationStatus(
        classMatchesDesktop === false
          ? "Reference result needs review"
          : classificationUsesReference
            ? "Desktop class decision confirmed"
            : "Local classification completed",
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Classification could not be completed.";
      setClassificationError(message);
      setClassificationStatus("Classification could not be completed");
    } finally {
      setClassificationIsRunning(false);
    }
  };

  const selectRosetteReference = (referenceId: string) => {
    const reference =
      ROSETTE_REFERENCES.find((candidate) => candidate.id === referenceId) ??
      ROSETTE_REFERENCES[0];
    setRosetteImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return reference.imagePath;
    });
    setRosetteReferenceId(reference.id);
    setRosetteFileName(reference.displayName);
    setRosetteUsesReference(true);
    setRosetteResult(null);
    setRosetteError(null);
    setRosetteStatus("Ready for the selected reference test");
  };

  const selectRosetteImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setRosetteImagePath((previousPath) => {
      if (previousPath.startsWith("blob:")) URL.revokeObjectURL(previousPath);
      return URL.createObjectURL(file);
    });
    setRosetteFileName(file.name);
    setRosetteUsesReference(false);
    setRosetteResult(null);
    setRosetteError(null);
    setRosetteStatus("Image ready for local rosette detection");
  };

  const useRosetteReference = () => selectRosetteReference(rosetteReferenceId);

  const runRosetteDetection = async () => {
    if (rosetteIsRunning) return;
    setRosetteIsRunning(true);
    setRosetteResult(null);
    setRosetteError(null);

    try {
      setRosetteStatus(
        rosetteUsesReference ? "Loading the released reference…" : "Preparing your image…",
      );
      const [sourceImage, analysisImage, expectedInput, expectedRaw, expectedPayload] =
        await Promise.all([
          loadImage(rosetteImagePath),
          rosetteUsesReference
            ? loadImage(selectedRosetteReference.analysisInputPath)
            : Promise.resolve(null),
          rosetteUsesReference
            ? loadFloat32(selectedRosetteReference.expectedInputPath)
            : Promise.resolve(null),
          rosetteUsesReference
            ? loadFloat32(selectedRosetteReference.expectedOutputPath)
            : Promise.resolve(null),
          rosetteUsesReference
            ? loadJson<RosetteExpectedPayload>(
                selectedRosetteReference.expectedDetectionsPath,
              )
            : Promise.resolve(null),
        ]);

      if (
        sourceImage.naturalWidth > 8192 ||
        sourceImage.naturalHeight > 8192 ||
        sourceImage.naturalWidth * sourceImage.naturalHeight > 25_000_000
      ) {
        throw new Error(
          "This image is too large for safe in-browser detection. Use an image up to 8192 px per side and 25 megapixels.",
        );
      }

      const preprocessCanvas = rosettePreprocessCanvasRef.current;
      const outputCanvas = rosetteOutputCanvasRef.current;
      if (!preprocessCanvas || !outputCanvas) {
        throw new Error("The rosette image canvases are unavailable.");
      }

      let input: Float32Array;
      let inputWidth: number;
      let inputHeight: number;
      let maxInputError: number | null = null;
      if (analysisImage && expectedInput && expectedPayload) {
        preprocessCanvas.width = expectedPayload.input_width;
        preprocessCanvas.height = expectedPayload.input_height;
        const context = preprocessCanvas.getContext("2d");
        if (!context) throw new Error("The rosette reference could not be prepared.");
        context.drawImage(analysisImage, 0, 0);
        input = canvasToRosetteTensor(preprocessCanvas);
        inputWidth = preprocessCanvas.width;
        inputHeight = preprocessCanvas.height;
        maxInputError = 0;
        for (let index = 0; index < input.length; index += 1) {
          maxInputError = Math.max(maxInputError, Math.abs(input[index] - expectedInput[index]));
        }
      } else {
        const prepared = prepareUserRosetteInput(sourceImage, preprocessCanvas);
        input = prepared.input;
        inputWidth = prepared.inputWidth;
        inputHeight = prepared.inputHeight;
      }

      setRosetteStatus(
        cachedRosetteSession
          ? "Running the cached rosette detector…"
          : "Loading the local rosette detector…",
      );
      const { session, usedCachedModel } = await getRosetteSession();
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];
      const inferenceStarted = nowMilliseconds();
      const outputs = await session.run({
        [inputName]: new ort.Tensor("float32", input, [
          1,
          3,
          inputHeight,
          inputWidth,
        ]),
      });
      const inferenceSeconds = (nowMilliseconds() - inferenceStarted) / 1000;
      const output = outputs[outputName];
      const raw = output.data as Float32Array;
      const detections = postprocessRosetteOutput(
        raw,
        output.dims,
        inputWidth,
        inputHeight,
        sourceImage.naturalWidth,
        sourceImage.naturalHeight,
      );
      drawRosetteDetections(outputCanvas, sourceImage, detections);

      let maxRawOutputError: number | null = null;
      let detectionCountMatches: boolean | null = null;
      let matchedIou: number | null = null;
      if (expectedRaw && expectedPayload) {
        maxRawOutputError = 0;
        for (let index = 0; index < raw.length; index += 1) {
          maxRawOutputError = Math.max(
            maxRawOutputError,
            Math.abs(raw[index] - expectedRaw[index]),
          );
        }
        const expectedDetections = expectedPayload.detections.map((detection) => ({
          x1: detection.x1,
          y1: detection.y1,
          x2: detection.x2,
          y2: detection.y2,
          confidence: detection.confidence,
          classId: detection.class_id,
        }));
        detectionCountMatches = detections.length === expectedDetections.length;
        matchedIou = minimumMatchedIou(detections, expectedDetections);
      }

      setRosetteResult({
        detections,
        originalWidth: sourceImage.naturalWidth,
        originalHeight: sourceImage.naturalHeight,
        inputWidth,
        inputHeight,
        modelLoadSeconds: cachedRosetteLoadMilliseconds / 1000,
        inferenceSeconds,
        usedCachedModel,
        isReference: rosetteUsesReference,
        maxInputError,
        maxRawOutputError,
        detectionCountMatches,
        minimumMatchedIou: matchedIou,
      });
      setRosetteStatus(
        rosetteUsesReference
          ? detectionCountMatches && matchedIou !== null && matchedIou >= 0.999
            ? "Desktop rosette detections confirmed"
            : "Reference detections need review"
          : `Detection complete · ${detections.length} rosettes`,
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Rosette detection could not be completed.";
      setRosetteError(message);
      setRosetteStatus("Rosette detection could not be completed");
    } finally {
      setRosetteIsRunning(false);
    }
  };

  const rosetteDownloadBase = rosetteFileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "brain-rosette";

  const downloadRosetteImage = () => {
    const canvas = rosetteOutputCanvasRef.current;
    if (!canvas || !rosetteResult) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${rosetteDownloadBase}-detections.png`);
    }, "image/png");
  };

  const downloadRosetteDetections = () => {
    if (!rosetteResult) return;
    const lines = [
      "detection_id,label,confidence,x1_px,y1_px,x2_px,y2_px,width_px,height_px",
      ...rosetteResult.detections.map(
        (detection, index) =>
          `${index + 1},Rosette,${detection.confidence},${detection.x1},${detection.y1},${detection.x2},${detection.y2},${detection.x2 - detection.x1},${detection.y2 - detection.y1}`,
      ),
    ];
    downloadBlob(
      new Blob([`\ufeff${lines.join("\n")}\n`], { type: "text/csv;charset=utf-8" }),
      `${rosetteDownloadBase}-detections.csv`,
    );
  };

  return (
    <main>
      <header className="topbar" id="top">
        <div className="brandCluster">
          <Link className="brand" href="/" aria-label="BrAIn analysis tool">
            <strong>BrAIn</strong>
            <span>AI-Based Morphology Analysis Tool for Organoids</span>
          </Link>
          <nav className="siteNav" aria-label="Project information">
            <Link className="active" href="/">BrAIn</Link>
            <Link href="/about">About</Link>
            <Link href="/paper">Paper</Link>
            <Link href="/licensing">Licensing</Link>
            <Link href="/team">Team</Link>
          </nav>
        </div>
        <span className="privacyBadge">Images stay on this device</span>
      </header>

      <nav className="moduleDock" aria-label="BrAIn analysis modules">
        <button
          type="button"
          className={`moduleTab ${activeModule === "classification" ? "active" : ""}`}
          aria-pressed={activeModule === "classification"}
          onClick={() => setActiveModule("classification")}
        >
          <span className="moduleNumber">01</span>
          <span className="moduleTabCopy">
            <strong>Classification</strong>
            <small>Abnormal or budding assessment</small>
          </span>
          <span className="moduleState live">2 live</span>
        </button>

        <button
          type="button"
          className={`moduleTab ${activeModule === "segmentation" ? "active" : ""}`}
          aria-pressed={activeModule === "segmentation"}
          onClick={() => setActiveModule("segmentation")}
        >
          <span className="moduleNumber">02</span>
          <span className="moduleTabCopy">
            <strong>Segmentation</strong>
            <small>Binary mask and morphology</small>
          </span>
          <span className="moduleState live">2 live</span>
        </button>

        <button
          type="button"
          className={`moduleTab ${activeModule === "rosette" ? "active" : ""}`}
          aria-pressed={activeModule === "rosette"}
          onClick={() => setActiveModule("rosette")}
        >
          <span className="moduleNumber">03</span>
          <span className="moduleTabCopy">
            <strong>Rosette detection</strong>
            <small>Locate neural rosettes</small>
          </span>
          <span className="moduleState">Live</span>
        </button>
      </nav>

      {activeModule === "segmentation" && (
        <>
          <section className="moduleHeading" aria-labelledby="segmentation-heading">
            <div>
              <p className="cardKicker">Segmentation workflow</p>
              <h2 id="segmentation-heading">Choose the structure to segment</h2>
            </div>
            <div className="submoduleSwitch" role="group" aria-label="Segmentation target">
              <button
                type="button"
                className={segmentationMode === "bo" ? "active" : ""}
                aria-pressed={segmentationMode === "bo"}
                onClick={() => setSegmentationMode("bo")}
              >
                Brain organoid
              </button>
              <button
                type="button"
                className={segmentationMode === "eb" ? "active" : ""}
                aria-pressed={segmentationMode === "eb"}
                onClick={() => setSegmentationMode("eb")}
              >
                Embryoid body
              </button>
            </div>
          </section>

          {segmentationMode === "bo" ? (
            <>
      <section className="referenceLibrary" aria-labelledby="bo-reference-library">
        <div className="referenceLibraryHeader">
          <div>
            <p className="cardKicker">Reference library</p>
            <h2 id="bo-reference-library">Try another validated BO image</h2>
          </div>
          <span>{BO_REFERENCES.length} released examples</span>
        </div>
        <div className="referenceStrip">
          {BO_REFERENCES.map((reference) => (
            <button
              key={reference.id}
              type="button"
              className={`referenceTile ${boReferenceId === reference.id ? "active" : ""}`}
              aria-pressed={boReferenceId === reference.id}
              onClick={() => selectBoReference(reference.id)}
            >
              <img src={reference.imagePath} alt="" />
              <span>
                <strong>{reference.id}</strong>
                <small>BO segmentation</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="workspace" aria-label="BrAIn reference validation">
        <article className="visualCard">
          <div className="cardHeader">
            <div>
              <p className="cardKicker">Reference sample</p>
              <h2>{selectedBoReference.id}</h2>
            </div>
            <span className="sampleMeta">256 × 256 px</span>
          </div>

          <div className="imageGrid">
            <figure>
              <div className="imageFrame">
                <canvas ref={inputCanvasRef} aria-label="Reference brain organoid image" />
                {!result && (
                  <img
                    src={selectedBoReference.imagePath}
                    alt={`Reference brain organoid ${selectedBoReference.id}`}
                  />
                )}
              </div>
              <figcaption>Original image</figcaption>
            </figure>
            <figure>
              <div className="imageFrame outputFrame">
                <canvas ref={outputCanvasRef} aria-label="BrAIn binary segmentation mask" />
                {!result && (
                  <div className="outputPlaceholder">Segmentation will appear here</div>
                )}
              </div>
              <figcaption>Binary segmentation mask</figcaption>
            </figure>
          </div>
        </article>

        <aside className="controlCard">
          <div>
            <p className="cardKicker">One-click test</p>
            <h2>Scientific equivalence</h2>
            <p className="controlCopy">
              The first run loads 124 MB of model weights. Later runs reuse the model
              already held in the browser.
            </p>
          </div>

          <button type="button" onClick={runReferenceTest} disabled={isRunning}>
            <span>{isRunning ? "Running…" : result ? "Run again" : "Run reference test"}</span>
            <span aria-hidden="true">→</span>
          </button>

          <div
            className={`statusRow ${result?.disagreementPixels === 0 ? "passed" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span className="statusDot" aria-hidden="true" />
            <span>{status}</span>
          </div>

          {error && <p className="errorMessage">{error}</p>}

          <dl className="metrics">
            <div>
              <dt>Mask Dice</dt>
              <dd>{result ? result.dice.toFixed(6) : "—"}</dd>
            </div>
            <div>
              <dt>Different pixels</dt>
              <dd>{result ? result.disagreementPixels.toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt>Model load</dt>
              <dd>{result ? `${result.modelLoadSeconds.toFixed(2)} s` : "—"}</dd>
            </div>
            <div>
              <dt>Inference</dt>
              <dd>{result ? `${result.inferenceSeconds.toFixed(2)} s` : "—"}</dd>
            </div>
          </dl>

          {result && (
            <div className="technicalNote">
              <span>{result.usedCachedModel ? "Cached model" : "Cold model load"}</span>
              <span>Max error {result.maxProbabilityError.toExponential(2)}</span>
              <span>Input error {result.maxInputError.toExponential(1)}</span>
            </div>
          )}
        </aside>
      </section>

      <section className="morphologySection" aria-labelledby="morphology-title">
        <div className="morphologyHeader">
          <div>
            <p className="cardKicker">Paper-defined outputs</p>
            <h2 id="morphology-title">Published morphology parameters</h2>
            <p className="sectionCopy">
              Measurements are derived from the binary mask using the definitions in
              the BrAIn paper and released desktop application.
            </p>
          </div>

          <label className="pixelSizeControl">
            <span>Pixel size</span>
            <span className="pixelSizeField">
              <input
                type="number"
                min="0.001"
                step="0.01"
                inputMode="decimal"
                value={pixelSizeInput}
                onChange={(event) => setPixelSizeInput(event.target.value)}
                aria-describedby="pixel-size-help"
              />
              <span>µm/px</span>
            </span>
            <small id="pixel-size-help">
              {hasValidPixelSize ? "Adjust to match your microscope." : "Enter a positive value."}
            </small>
          </label>
        </div>

        <div className="morphologyGrid">
          <article className="morphologyCard">
            <span className="parameterIndex">01</span>
            <h3>Area</h3>
            <strong>
              {showMorphology
                ? `${(selectedBoReference.morphology.areaPixels * pixelSize ** 2).toLocaleString(undefined, { maximumFractionDigits: 2 })} µm²`
                : "—"}
            </strong>
            <small>{result ? `${selectedBoReference.morphology.areaPixels.toLocaleString()} px²` : "Run the analysis"}</small>
          </article>

          <article className="morphologyCard">
            <span className="parameterIndex">02</span>
            <h3>Feret diameter</h3>
            <strong>
              {showMorphology
                ? `${(selectedBoReference.morphology.feretPixels * pixelSize).toFixed(2)} µm`
                : "—"}
            </strong>
            <small>{result ? `${selectedBoReference.morphology.feretPixels.toFixed(2)} px` : "Run the analysis"}</small>
          </article>

          <article className="morphologyCard">
            <span className="parameterIndex">03</span>
            <h3>Perimeter</h3>
            <strong>
              {showMorphology
                ? `${(selectedBoReference.morphology.perimeterPixels * pixelSize).toFixed(2)} µm`
                : "—"}
            </strong>
            <small>{result ? `${selectedBoReference.morphology.perimeterPixels.toFixed(2)} px` : "Run the analysis"}</small>
          </article>

          <article className="morphologyCard">
            <span className="parameterIndex">04</span>
            <h3>Roundness</h3>
            <strong>{showMorphology ? selectedBoReference.morphology.roundness.toFixed(4) : "—"}</strong>
            <small>Unitless shape index</small>
          </article>

          <article className="morphologyCard">
            <span className="parameterIndex">05</span>
            <h3>Circularity</h3>
            <strong>{showMorphology ? selectedBoReference.morphology.circularity.toFixed(4) : "—"}</strong>
            <small>Unitless shape index</small>
          </article>
        </div>

        <p className="morphologyNote">
          Current values reproduce the released desktop measurements for the validated
          reference sample. Live measurements for uploaded images are the next step.
        </p>
      </section>
            </>
          ) : (
            <>
              <section className="referenceLibrary" aria-labelledby="eb-reference-library">
                <div className="referenceLibraryHeader">
                  <div>
                    <p className="cardKicker">Published reference library</p>
                    <h2 id="eb-reference-library">Try EB images from Figure 5a</h2>
                  </div>
                  <span>{EB_REFERENCES.length} published examples</span>
                </div>
                <div className="referenceStrip">
                  {EB_REFERENCES.map((reference) => (
                    <button
                      key={reference.id}
                      type="button"
                      className={`referenceTile ${ebUsesReference && ebReferenceId === reference.id ? "active" : ""}`}
                      aria-pressed={ebUsesReference && ebReferenceId === reference.id}
                      onClick={() => selectEbReference(reference.id)}
                    >
                      <img src={reference.thumbnailPath} alt="" />
                      <span>
                        <strong>{reference.displayName}</strong>
                        <small>Figure 5a · EB</small>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="workspace" aria-label="BrAIn EB segmentation analysis">
                <article className="visualCard">
                  <div className="cardHeader">
                    <div>
                      <p className="cardKicker">
                        {ebUsesReference ? "Published EB reference" : "User EB image"}
                      </p>
                      <h2>{ebFileName}</h2>
                    </div>
                    <span className="sampleMeta">
                      {ebResult
                        ? `${ebResult.morphology.originalWidth} × ${ebResult.morphology.originalHeight} px mask`
                        : "256 × 256 model input"}
                    </span>
                  </div>

                  <div className="imageGrid">
                    <figure>
                      <div className="imageFrame">
                        <canvas ref={ebInputCanvasRef} aria-label="EB model input image" />
                        {!ebResult && (
                          <img
                            src={ebImagePath}
                            alt={ebFileName}
                          />
                        )}
                      </div>
                      <figcaption>
                        {ebResult
                          ? "Grayscale model input"
                          : ebUsesReference
                            ? "Published raw image"
                            : "Selected local image"}
                      </figcaption>
                    </figure>
                    <figure>
                      <div className="imageFrame outputFrame">
                        <canvas ref={ebOutputCanvasRef} aria-label="BrAIn EB binary mask" />
                        {!ebResult && (
                          <div className="outputPlaceholder">EB mask will appear here</div>
                        )}
                      </div>
                      <figcaption>Binary EB segmentation mask</figcaption>
                    </figure>
                  </div>

                  <div className={`classificationFileActions ${ebUsesReference ? "single" : ""}`}>
                    <label className="filePicker">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/bmp"
                        onChange={selectEbImage}
                      />
                      <span>Choose your EB image</span>
                    </label>
                    {!ebUsesReference && (
                      <button
                        type="button"
                        className="referenceButton"
                        onClick={useEbReference}
                      >
                        Use published reference
                      </button>
                    )}
                  </div>
                </article>

                <aside className="controlCard">
                  <div>
                    <p className="cardKicker">Device-local EB model</p>
                    <h2>{ebUsesReference ? "Scientific equivalence" : "Analyze your EB image"}</h2>
                    <p className="controlCopy">
                      {ebUsesReference
                        ? "The 124 MB FP32 model runs locally. Later EB runs reuse the model already held in the browser."
                        : "Your image stays on this device. The mask is restored to the original image size before morphology is measured."}
                    </p>
                  </div>

                  <button type="button" onClick={runEbAnalysis} disabled={ebIsRunning}>
                    <span>
                      {ebIsRunning
                        ? "Running…"
                        : ebResult
                          ? "Run again"
                          : ebUsesReference
                            ? "Run published reference"
                            : "Analyze selected image"}
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>

                  <div
                    className={`statusRow ${ebResult && (!ebResult.validation || ebResult.validation.disagreementPixels === 0) ? "passed" : ""}`}
                    role="status"
                    aria-live="polite"
                  >
                    <span className="statusDot" aria-hidden="true" />
                    <span>{ebStatus}</span>
                  </div>

                  {ebError && <p className="errorMessage">{ebError}</p>}

                  <dl className="metrics">
                    <div>
                      <dt>{ebUsesReference ? "Mask Dice" : "Detected regions"}</dt>
                      <dd>
                        {ebResult
                          ? ebResult.validation
                            ? ebResult.validation.dice.toFixed(6)
                            : ebResult.morphology.regionCount.toLocaleString()
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>{ebUsesReference ? "Different pixels" : "Mask size"}</dt>
                      <dd>
                        {ebResult
                          ? ebResult.validation
                            ? ebResult.validation.disagreementPixels.toLocaleString()
                            : `${ebResult.morphology.originalWidth}×${ebResult.morphology.originalHeight}`
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>Model load</dt>
                      <dd>{ebResult ? `${ebResult.modelLoadSeconds.toFixed(2)} s` : "—"}</dd>
                    </div>
                    <div>
                      <dt>Inference</dt>
                      <dd>{ebResult ? `${ebResult.inferenceSeconds.toFixed(2)} s` : "—"}</dd>
                    </div>
                  </dl>

                  {ebResult && (
                    <div className="technicalNote">
                      <span>{ebResult.usedCachedModel ? "Cached model" : "Cold model load"}</span>
                      {ebResult.validation && (
                        <>
                          <span>
                            Max error {ebResult.validation.maxProbabilityError.toExponential(2)}
                          </span>
                          <span>
                            Input error {ebResult.validation.maxInputError.toExponential(1)}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {ebResult && (
                    <div className="downloadActions">
                      <button type="button" className="downloadButton" onClick={downloadEbMask}>
                        Download mask PNG
                      </button>
                      <button
                        type="button"
                        className="downloadButton"
                        onClick={downloadEbMeasurements}
                        disabled={!hasValidPixelSize}
                      >
                        Download measurements CSV
                      </button>
                    </div>
                  )}
                </aside>
              </section>

              <section className="morphologySection" aria-labelledby="eb-morphology-title">
                <div className="morphologyHeader">
                  <div>
                    <p className="cardKicker">Paper-defined EB outputs</p>
                    <h2 id="eb-morphology-title">EB count and mean morphology</h2>
                    <p className="sectionCopy">
                      Figure 5 reports EB number, average area and average Feret diameter.
                      Values below use the desktop model&apos;s connected regions.
                    </p>
                  </div>

                  <label className="pixelSizeControl">
                    <span>Pixel size</span>
                    <span className="pixelSizeField">
                      <input
                        type="number"
                        min="0.001"
                        step="0.01"
                        inputMode="decimal"
                        value={pixelSizeInput}
                        onChange={(event) => setPixelSizeInput(event.target.value)}
                        aria-describedby="eb-pixel-size-help"
                      />
                      <span>µm/px</span>
                    </span>
                    <small id="eb-pixel-size-help">
                      {hasValidPixelSize
                        ? "Adjust to match the source microscope."
                        : "Enter a positive value."}
                    </small>
                  </label>
                </div>

                <div className="morphologyGrid ebMorphologyGrid">
                  <article className="morphologyCard">
                    <span className="parameterIndex">01</span>
                    <h3>Detected EB regions</h3>
                    <strong>{ebResult ? ebResult.morphology.regionCount : "—"}</strong>
                    <small>Connected regions · no size filtering</small>
                  </article>
                  <article className="morphologyCard">
                    <span className="parameterIndex">02</span>
                    <h3>Mean area</h3>
                    <strong>
                      {showEbMorphology
                        ? `${(ebResult!.morphology.meanAreaPixels * pixelSize ** 2).toFixed(2)} µm²`
                        : "—"}
                    </strong>
                    <small>
                      {ebResult
                        ? `${ebResult.morphology.meanAreaPixels.toFixed(2)} px²`
                        : "Run the analysis"}
                    </small>
                  </article>
                  <article className="morphologyCard">
                    <span className="parameterIndex">03</span>
                    <h3>Mean Feret diameter</h3>
                    <strong>
                      {showEbMorphology
                        ? `${(ebResult!.morphology.meanFeretPixels * pixelSize).toFixed(2)} µm`
                        : "—"}
                    </strong>
                    <small>
                      {ebResult
                        ? `${ebResult.morphology.meanFeretPixels.toFixed(2)} px`
                        : "Run the analysis"}
                    </small>
                  </article>
                </div>

                <p className="morphologyNote">
                  {ebUsesReference
                    ? "These are published-figure crops used for browser equivalence, not the independent EB test set or ground-truth masks. Full-resolution EB reference data is not included in the current Zenodo package."
                    : "Measurements come from the generated binary mask at the original image resolution. Confirm the microscope pixel size before using µm-based values; connected regions are reported without size filtering."}
                </p>
              </section>
            </>
          )}
        </>
      )}

      {activeModule === "classification" && (
        <section className="futureModulePanel" aria-labelledby="classification-heading">
          <div className="futureModuleHeader">
            <div>
              <p className="cardKicker">Classification workflow</p>
              <h2 id="classification-heading">Select a released classification task</h2>
              <p className="sectionCopy">
                Both released classifiers now run locally in the browser. Choose a
                validated reference or select your own image without uploading it.
              </p>
            </div>
            <span className="readinessBadge ready">
              {classificationMode === "abnormal"
                ? "Abnormal–Normal live"
                : "Budding–Normal live"}
            </span>
          </div>

          <div className="submoduleSwitch wide" role="group" aria-label="Classification task">
            <button
              type="button"
              className={classificationMode === "abnormal" ? "active" : ""}
              aria-pressed={classificationMode === "abnormal"}
              onClick={() => changeClassificationMode("abnormal")}
            >
              Abnormal–Normal
            </button>
            <button
              type="button"
              className={classificationMode === "budding" ? "active" : ""}
              aria-pressed={classificationMode === "budding"}
              onClick={() => changeClassificationMode("budding")}
            >
              Budding–Normal
            </button>
          </div>

            <section
              className="referenceLibrary embedded"
              aria-labelledby="classification-reference-library"
            >
              <div className="referenceLibraryHeader">
                <div>
                  <p className="cardKicker">Reference library</p>
                  <h2 id="classification-reference-library">
                    Try released {classificationTargetLabel} and Normal images
                  </h2>
                </div>
                <span>{activeClassificationReferences.length} balanced examples</span>
              </div>
              <div className="referenceStrip classificationReferences">
                {activeClassificationReferences.map((reference) => (
                  <button
                    key={reference.slug}
                    type="button"
                    className={`referenceTile ${classificationUsesReference && classificationReferenceSlug === reference.slug ? "active" : ""}`}
                    aria-pressed={
                      classificationUsesReference &&
                      classificationReferenceSlug === reference.slug
                    }
                    onClick={() => selectClassificationReference(reference)}
                  >
                    <img src={reference.thumbnailPath} alt="" />
                    <span>
                      <strong>{reference.displayName}</strong>
                      <small>{reference.expectedLabel}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <div className="classificationWorkspace">
              <article className="classificationVisualCard">
                <div className="cardHeader">
                  <div>
                    <p className="cardKicker">
                      {classificationUsesReference ? "Released reference" : "User image"}
                    </p>
                    <h2>{classificationFileName}</h2>
                  </div>
                  <span className="sampleMeta">550 × 550 model input</span>
                </div>

                <figure>
                  <div className="classificationImageFrame">
                    <img src={classificationImagePath} alt="Image selected for classification" />
                    <canvas ref={classificationCanvasRef} aria-hidden="true" />
                  </div>
                  <figcaption>
                    {classificationUsesReference
                      ? `Released ${selectedClassificationReference.expectedLabel.toLowerCase()} test image`
                      : "Selected local image"}
                  </figcaption>
                </figure>

                <div className="classificationFileActions">
                  <label className="filePicker">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/bmp"
                      onChange={selectClassificationImage}
                    />
                    <span>Choose your image</span>
                  </label>
                  {!classificationUsesReference && (
                    <button
                      type="button"
                      className="referenceButton"
                      onClick={useClassificationReference}
                    >
                      Use released reference
                    </button>
                  )}
                </div>
              </article>

              <aside className="classificationControlCard">
                <div>
                  <p className="cardKicker">Device-local classifier</p>
                  <h2>{classificationTargetLabel} vs Normal</h2>
                  <p className="controlCopy">
                    The {classificationModelSize} FP32 model runs on this device. The selected image is
                    resized and classified without being uploaded.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={runClassification}
                  disabled={classificationIsRunning}
                >
                  <span>
                    {classificationIsRunning
                      ? "Classifying…"
                      : classificationResult
                        ? "Run again"
                        : classificationUsesReference
                          ? "Run reference test"
                          : "Analyze selected image"}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>

                <div
                  className={`statusRow ${classificationResult && classificationResult.classMatchesDesktop !== false ? "passed" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  <span className="statusDot" aria-hidden="true" />
                  <span>{classificationStatus}</span>
                </div>

                {classificationError && (
                  <p className="errorMessage">{classificationError}</p>
                )}

                {classificationResult ? (
                  <div className="classificationResult">
                    <p>Predicted class</p>
                    <strong>{classificationResult.predictedLabel}</strong>
                    <small>
                      {(Math.max(
                        classificationResult.targetProbability,
                        classificationResult.normalProbability,
                      ) * 100).toFixed(2)}% model confidence
                    </small>

                    <div className="probabilityRows">
                      <div>
                        <span>{classificationTargetLabel}</span>
                        <span>{(classificationResult.targetProbability * 100).toFixed(2)}%</span>
                        <i>
                          <b style={{ width: `${classificationResult.targetProbability * 100}%` }} />
                        </i>
                      </div>
                      <div>
                        <span>Normal</span>
                        <span>{(classificationResult.normalProbability * 100).toFixed(2)}%</span>
                        <i>
                          <b style={{ width: `${classificationResult.normalProbability * 100}%` }} />
                        </i>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="classificationEmptyResult">
                    <span>Prediction</span>
                    <strong>—</strong>
                    <small>Run the model to see the class and confidence.</small>
                  </div>
                )}

                {classificationResult && (
                  <div className="technicalNote">
                    <span>
                      {classificationResult.usedCachedModel
                        ? "Cached model"
                        : "Cold model load"}
                    </span>
                    <span>
                      Model load {classificationResult.modelLoadSeconds.toFixed(2)} s
                    </span>
                    <span>Inference {classificationResult.inferenceSeconds.toFixed(2)} s</span>
                    {classificationResult.maxProbabilityError !== null && (
                      <span>
                        Max error {classificationResult.maxProbabilityError.toExponential(2)}
                      </span>
                    )}
                    {classificationResult.maxInputError !== null && (
                      <span>
                        Input delta {classificationResult.maxInputError.toExponential(2)}
                      </span>
                    )}
                  </div>
                )}
              </aside>
            </div>
        </section>
      )}

      {activeModule === "rosette" && (
        <section className="futureModulePanel" aria-labelledby="rosette-heading">
          <div className="futureModuleHeader">
            <div>
              <p className="cardKicker">Object-detection workflow</p>
              <h2 id="rosette-heading">Neural-rosette detection</h2>
              <p className="sectionCopy">
                Run the released detector locally, inspect confidence-labelled boxes,
                and download the annotated image or detection table.
              </p>
            </div>
            <span className="readinessBadge ready">Rosette detector live</span>
          </div>

          <section className="referenceLibrary embedded" aria-labelledby="rosette-reference-library">
            <div className="referenceLibraryHeader">
              <div>
                <p className="cardKicker">Released validation library</p>
                <h2 id="rosette-reference-library">Try validated rosette images</h2>
              </div>
              <span>{ROSETTE_REFERENCES.length} released examples</span>
            </div>
            <div className="referenceStrip">
              {ROSETTE_REFERENCES.map((reference) => (
                <button
                  key={reference.id}
                  type="button"
                  className={`referenceTile ${rosetteUsesReference && rosetteReferenceId === reference.id ? "active" : ""}`}
                  aria-pressed={rosetteUsesReference && rosetteReferenceId === reference.id}
                  onClick={() => selectRosetteReference(reference.id)}
                >
                  <img src={reference.thumbnailPath} alt="" />
                  <span>
                    <strong>{reference.displayName}</strong>
                    <small>{reference.expectedCount} desktop detections</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="workspace rosetteWorkspace">
            <article className="visualCard">
              <div className="cardHeader">
                <div>
                  <p className="cardKicker">
                    {rosetteUsesReference ? "Released rosette reference" : "User image"}
                  </p>
                  <h2>{rosetteFileName}</h2>
                </div>
                <span className="sampleMeta">
                  {rosetteResult
                    ? `${rosetteResult.originalWidth} × ${rosetteResult.originalHeight} px`
                    : "Dynamic 704 px model input"}
                </span>
              </div>

              <div className="imageGrid rosetteImageGrid">
                <figure>
                  <div className="imageFrame rosetteImageFrame">
                    <img src={rosetteImagePath} alt={`Original ${rosetteFileName}`} />
                  </div>
                  <figcaption>Original image</figcaption>
                </figure>
                <figure>
                  <div className="imageFrame outputFrame rosetteImageFrame">
                    <canvas
                      ref={rosetteOutputCanvasRef}
                      aria-label="Image with detected neural rosettes"
                    />
                    {!rosetteResult && (
                      <div className="outputPlaceholder">
                        Detected rosettes will appear here
                      </div>
                    )}
                  </div>
                  <figcaption>Confidence-labelled detection result</figcaption>
                </figure>
              </div>

              <canvas ref={rosettePreprocessCanvasRef} className="hiddenAnalysisCanvas" aria-hidden="true" />

              <div className={`classificationFileActions ${rosetteUsesReference ? "single" : ""}`}>
                <label className="filePicker">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/bmp"
                    onChange={selectRosetteImage}
                  />
                  <span>Choose your rosette image</span>
                </label>
                {!rosetteUsesReference && (
                  <button type="button" className="referenceButton" onClick={useRosetteReference}>
                    Use released reference
                  </button>
                )}
              </div>
            </article>

            <aside className="controlCard rosetteControlCard">
              <div>
                <p className="cardKicker">Device-local YOLOv8 detector</p>
                <h2>{rosetteUsesReference ? "Scientific equivalence" : "Detect neural rosettes"}</h2>
                <p className="controlCopy">
                  The 104 MB FP32 detector runs on this device. Images are not uploaded.
                  Confidence threshold is 0.25 and NMS IoU is 0.70, matching the desktop defaults.
                </p>
              </div>

              <button type="button" onClick={runRosetteDetection} disabled={rosetteIsRunning}>
                <span>
                  {rosetteIsRunning
                    ? "Detecting…"
                    : rosetteResult
                      ? "Run again"
                      : rosetteUsesReference
                        ? "Run reference test"
                        : "Detect rosettes"}
                </span>
                <span aria-hidden="true">→</span>
              </button>

              <div
                className={`statusRow ${rosetteResult && (rosetteResult.detectionCountMatches !== false) ? "passed" : ""}`}
                role="status"
                aria-live="polite"
              >
                <span className="statusDot" aria-hidden="true" />
                <span>{rosetteStatus}</span>
              </div>

              {rosetteError && <p className="errorMessage">{rosetteError}</p>}

              <dl className="metrics">
                <div>
                  <dt>Detected rosettes</dt>
                  <dd>{rosetteResult ? rosetteResult.detections.length : "—"}</dd>
                </div>
                <div>
                  <dt>Top confidence</dt>
                  <dd>
                    {rosetteResult && rosetteResult.detections.length
                      ? `${(rosetteResult.detections[0].confidence * 100).toFixed(1)}%`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Model load</dt>
                  <dd>{rosetteResult ? `${rosetteResult.modelLoadSeconds.toFixed(2)} s` : "—"}</dd>
                </div>
                <div>
                  <dt>Inference</dt>
                  <dd>{rosetteResult ? `${rosetteResult.inferenceSeconds.toFixed(2)} s` : "—"}</dd>
                </div>
              </dl>

              {rosetteResult?.isReference && (
                <div className="technicalNote">
                  <span>{rosetteResult.usedCachedModel ? "Cached model" : "Cold model load"}</span>
                  <span>Count {rosetteResult.detectionCountMatches ? "matched" : "different"}</span>
                  <span>Min IoU {rosetteResult.minimumMatchedIou?.toFixed(6)}</span>
                  <span>Raw error {rosetteResult.maxRawOutputError?.toExponential(2)}</span>
                  <span>Input error {rosetteResult.maxInputError?.toExponential(1)}</span>
                </div>
              )}

              {rosetteResult && (
                <div className="downloadActions">
                  <button type="button" className="downloadButton" onClick={downloadRosetteImage}>
                    Download annotated PNG
                  </button>
                  <button type="button" className="downloadButton" onClick={downloadRosetteDetections}>
                    Download detections CSV
                  </button>
                </div>
              )}
            </aside>
          </div>

          {rosetteResult && (
            <section className="rosetteResults" aria-labelledby="rosette-results-heading">
              <div className="referenceLibraryHeader">
                <div>
                  <p className="cardKicker">Detection table</p>
                  <h2 id="rosette-results-heading">Rosette boxes and confidence</h2>
                </div>
                <span>{rosetteResult.detections.length} detections</span>
              </div>
              {rosetteResult.detections.length ? (
                <div className="rosetteDetectionList">
                  {rosetteResult.detections.map((detection, index) => (
                    <article key={`${detection.x1}-${detection.y1}-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>Rosette</strong>
                      <small>{(detection.confidence * 100).toFixed(2)}% confidence</small>
                      <code>
                        {detection.x1.toFixed(1)}, {detection.y1.toFixed(1)} → {detection.x2.toFixed(1)}, {detection.y2.toFixed(1)} px
                      </code>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="morphologyNote">No detections exceeded the 0.25 confidence threshold.</p>
              )}
            </section>
          )}

          <p className="rosetteLicenseNote">
            Public open-source release must preserve the Zenodo CC BY-SA 4.0 attribution
            and satisfy the Ultralytics AGPL-3.0 source-sharing requirements. This is an
            implementation boundary, not legal advice.
          </p>
        </section>
      )}

      <footer>
        <span>Local feasibility prototype</span>
        <span>BO + EB + 2 classifiers + rosette detection · FP32 · ONNX Runtime Web</span>
      </footer>
    </main>
  );
}

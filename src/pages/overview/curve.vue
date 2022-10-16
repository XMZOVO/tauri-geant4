<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import { onActivated, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '~/stores/store'

const props
  = defineProps<{
    modelValue?: string[]
  }>()

const emits = defineEmits(['update:modelValue'])

Exporting(Highcharts)

const store = useStore()
const route = useRoute()
let chart
const value = useVModel(props, 'modelValue', emits)

watch(value, (v) => {
  createCurveChart(store.calValue)
})

onMounted(() => {
  if (route.query.freshCurve)
    createCurveChart(store.calValue)
})

function createCurveChart(calValue = []) {
  chart = Highcharts.chart({
    chart: {
      animation: false,
      renderTo: 'curveChart',
      panning: { enabled: true },
      panKey: 'shift',
      backgroundColor: 'transparent',
      zooming: {
        type: 'x',
        resetButton: {
          theme: {
            fill: '#545454',
            style: {
              color: '#E5E5E5',
            },
            states: {
              hover: {
                fill: '#656565',
                style: {
                  color: '#E5E5E5',
                },
              },
            },
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      title: { text: '' },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
    },
    xAxis: {
      visible: false,
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        type: 'line',
        data: calValue,
        pointStart: 1,
      },
    ],
  })
}
</script>

<template>
  <div id="curveChart" flex-1 />
</template>

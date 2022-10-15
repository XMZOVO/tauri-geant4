<script setup lang="ts">
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import { onMounted } from 'vue'
import { useStore } from '~/stores/store'
Exporting(Highcharts)

const store = useStore()
onMounted(() => {
  if (store.spectrumData.countList)
    createFWHMChart()
})

function createFWHMChart() {
  const chart = Highcharts.chart({
    chart: {
      animation: false,
      renderTo: 'fwhmChart',
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
    plotOptions: {
      column: {
        borderWidth: 0,
        groupPadding: 0,
        pointPadding: 0,
        edgeWidth: 0,
        animation: false,
      },
    },
    yAxis: {
      title: { text: '' },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
    },
    xAxis: {
      visible: false,
      categories: store.spectrumData.energyList.map(item => item.toFixed(3)),
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        type: 'column',
        name: '计数',
        data: store.spectrumData.fwhmCountList,
        events: {
          click: (event) => {
          },
        },
      },
    ],
  })
}
</script>

<template>
  <div id="fwhmChart" flex-1 />
</template>

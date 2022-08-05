import { BrowserData } from '../../../types/site-analytics-data';
import {ChartType, PieChartConfig} from '@common/shared/charts/base-chart';

export function transformBrowserData(browserData: BrowserData[] = []): PieChartConfig {
    return {
        type: ChartType.PIE,
        tooltip: 'Number of Users',
        labels: browserData.map(data => data.browser),
        title: browserData.map(data => data.sessions+"%"), 
        color: browserData.map(data => data.color), 
        data: browserData.map(data => data.sessions),
        legend: false,
        options: {
            showLabel: true,
            donut: true,
        }
    };
}

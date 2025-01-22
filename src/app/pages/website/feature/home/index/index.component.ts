import { Component, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-index',
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {


  @ViewChildren('aspectImg') images!: QueryList<any>;
  private Index = 0;

  constructor() {}

  ngAfterViewInit() {
    this.changeImage();

    setInterval(() => {
      this.changeImage();
    }, 10000); 
  }


  changeImage() {
    const arrayImg = this.images.toArray();  

    arrayImg.forEach(img => img.nativeElement.style.display = 'none');
    
    arrayImg[this.Index].nativeElement.style.display = 'block';

    this.Index = (this.Index + 1) % arrayImg.length; 
  }
  
  changeImageleft() {
    const arrayImg = this.images.toArray();  

    arrayImg.forEach(img => img.nativeElement.style.display = 'none');
    
    arrayImg[this.Index].nativeElement.style.display = 'block';

    if(this.Index == 0)
    {
      this.Index = arrayImg.length;
    }
    
    this.Index = (this.Index - 1) % arrayImg.length; 
  }
}

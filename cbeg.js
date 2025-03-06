#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Barang {
    char name[50];
    int stock;
    double price;
    int isSpecial;
} Barang;

typedef struct Pemesanan {
  int idBarang;
  char name[50];
  int count;
  double price;
  double discount;
  double totalPrice;
} Pemesanan;

Barang barang[] = {
    {
        .name = "Penghapus",
        .stock = 11,
        .price = 3000.00,
        .isSpecial = 0
    },
    {
        .name = "Pensil",
        .stock = 8,
        .price = 4000.00,
        .isSpecial = 1
    },
    {
        .name = "Pulpen",
        .stock = 6,
        .price = 5000.00,
        .isSpecial = 0
    }
};

Pemesanan pemesanan[100];
Pemesanan* dynamicPemesanan;
int pemesananLen = sizeof(barang) / sizeof(barang[0]);
int pemesananLastIdx = 0;

int searchIdxPemesanan(int id){
  for(int i =0;i < pemesananLastIdx;i++){
    if(pemesanan[i].idBarang == id){
        return i;
    }
  }
  return -1;
}

void addPemesanan(int idBarang,int count){
    int id = searchIdxPemesanan(id);
    Pemesanan item;
    if(id != -1){
        item =  pemesanan[id];
    } else{
        item.count = 0;
    }

    int countPemesanan = item.count;
    countPemesanan += count;
    double discount = 0;
    if(count >= 3){
        discount += 10;
    }

    if(barang[idBarang].isSpecial == 1){
        discount += 20;
    }

    double totalDiscount = (barang[idBarang].price * countPemesanan) * (discount / 100);
    printf("%d",id);
    strcpy(item.name,barang[idBarang].name);
    item.discount = totalDiscount;
    item.price = barang[idBarang].price;
    item.count = countPemesanan;
    item.totalPrice = (barang[idBarang].price * countPemesanan) - totalDiscount;
    item.idBarang = idBarang;

    if(id == -1){
        pemesanan[pemesananLastIdx++] = item;
    } else{
        pemesanan[id] = item;
    }
}
void printBarang(){
    printf("-------------------------------------------------------\n");
    printf("|%-5s|%-15s|%-15s|%-15s|\n","id","name","stock","price");
   printf("-------------------------------------------------------\n");
    int len = sizeof(barang) / sizeof(barang[0]);
    for(int i = 0; i < len;i++){

         printf("|%-5d|%-15s|%-15d|%-15.2f|\n",i,barang[i].name,barang[i].stock,barang[i].price);
    }
  printf("-------------------------------------------------------\n");
}

double calculateTotalHarga(){
    double price = 0;
    for(int i=0; i < pemesananLastIdx;i++){
        price+= pemesanan[i].totalPrice;
    }

    return price;
}

void printPemesanan(){
    printf("---------------------------------------------------------------------------------\n");
    printf("|%-15s|%-15s|%-15s|%-15s|%-15s|\n","name","count","price","discount","total Price");
    printf("---------------------------------------------------------------------------------\n");

    for(int i = 0; i < pemesananLastIdx;i++){
         printf("|%-15s|%-15d|%-15.2f|%-15.2f|%-15.2f\n",pemesanan[i].name,
                pemesanan[i].count,pemesanan[i].price,pemesanan[i].discount,pemesanan[i].totalPrice);
    }
    printf("---------------------------------------------------------------------------------\n");
    printf("Total Harga : %.2f",calculateTotalHarga());
}

int bayar(){
    int totalHarga = calculateTotalHarga();
    int money = 0;
    printf("Masukan jumlah uang : ");
    scanf("%d",&money);

    if(totalHarga > money){
        printf("Uang tidak cukup\n");
        return bayar();
    }
    return money;
}

void pesanBarang(){
   int id = -1;
   int countItem = 0;
   printf("Pesan Barang\n");
   printf("Pilih Id Barang : ");
   scanf("%d",&id);
   printf("Masukan jumlah Barang :");
   scanf("%d",&countItem);
   addPemesanan(id,countItem);
   printf("Pilih Barang Lainnya ? Y for yes\n");
   char yes;
   scanf(" %c",&yes);
   if(yes == 'y'){
      pesanBarang();
   }
}

void cetakStruk(int money){
    FILE *file;
    file = fopen("./struct.txt","w");

    fprintf(file,"---------------------------------------------------------------------------------\n");
    fprintf(file,"|%-15s|%-15s|%-15s|%-15s|%-15s|\n","name","count","price","discount","total Price");
    fprintf(file,"---------------------------------------------------------------------------------\n");
    for(int i = 0; i < pemesananLastIdx;i++){
         fprintf(file,"|%-15s|%-15d|%-15.2f|%-15.2f|%-15.2f\n",pemesanan[i].name,
                pemesanan[i].count,pemesanan[i].price,pemesanan[i].discount,pemesanan[i].totalPrice);
    }
    fprintf(file,"---------------------------------------------------------------------------------\n");
    fprintf(file,"Total Harga : %.2f",calculateTotalHarga());
    fprintf(file,"Uang : %d",money);

    fclose(file);

}
int comp (const void* a,const void* b){
    Pemesanan* item1 = (Pemesanan*) a;
    Pemesanan* item2 = (Pemesanan*) b;
    return item2->totalPrice - item1->totalPrice;
}

int main()
{
    dynamicPemesanan = malloc(pemesananLen);
    fflush(stdout);
    printBarang();
    pesanBarang();
    qsort(pemesanan,pemesananLastIdx,sizeof(pemesanan[0]),comp);
    printPemesanan();
    int money = bayar();
    printf("Mencetak struk..");
    cetakStruk(money);
    return 0;
}
